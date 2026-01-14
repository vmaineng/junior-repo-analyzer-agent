from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
import httpx
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv
import anthropic
from datetime import datetime, timedelta
import re

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
if not ANTHROPIC_API_KEY:
    raise ValueError(
        "❌ ANTHROPIC_API_KEY not found in environment variables!\n"
        "Please add it to your .env file:\n"
        "ANTHROPIC_API_KEY=sk-ant-api03-your-key-here"
    )

print(f"✅ API Key loaded successfully (starts with: {ANTHROPIC_API_KEY[:15]}...)")

app = FastAPI(title="Junior Repo Analyzer API")

# CORS configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

claude_client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
print("✅ Anthropic client initialized successfully")

class RepoAnalysisRequest(BaseModel):
    """Request model for repository analysis"""
    repo_url: str
    github_token: Optional[str] = None


class RepoAnalysisResponse(BaseModel):
    """Response model for repository analysis"""
    is_junior_friendly: bool
    is_recently_active: bool
    confidence_score: float  # 0-100
    summary: str
    detailed_analysis: Dict[str, Any]
    recommendations: List[str]


class GitHubAPI:
    """GitHub API client for fetching repository data"""
    
    BASE_URL = "https://api.github.com"
    
    def __init__(self, token: Optional[str] = None):
        self.token = token or os.getenv("GITHUB_TOKEN")
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
        }
        if self.token:
            self.headers["Authorization"] = f"token {self.token}"
    
    def parse_repo_url(self, url: str) -> tuple[str, str]:
        """Extract owner and repo name from GitHub URL"""
        # Remove trailing slashes and .git
        url = url.rstrip('/').replace('.git', '')
        
        # Handle different GitHub URL formats
        patterns = [
            r"github\.com/([^/]+)/([^/]+)",
            r"^([^/]+)/([^/]+)$",  # owner/repo format
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1), match.group(2)
        
        raise ValueError("Invalid GitHub repository URL")
    
    async def get_repo_data(self, owner: str, repo: str) -> Dict[str, Any]:
        """Fetch comprehensive repository data from GitHub API"""
        async with httpx.AsyncClient() as client:
            # Fetch repository information
            repo_response = await client.get(
                f"{self.BASE_URL}/repos/{owner}/{repo}",
                headers=self.headers
            )
            
            if repo_response.status_code == 404:
                raise HTTPException(status_code=404, detail="Repository not found")
            elif repo_response.status_code != 200:
                raise HTTPException(
                    status_code=repo_response.status_code,
                    detail=f"GitHub API error: {repo_response.text}"
                )
            
            repo_data = repo_response.json()
            
            # Fetch recent commits
            commits_response = await client.get(
                f"{self.BASE_URL}/repos/{owner}/{repo}/commits",
                headers=self.headers,
                params={"per_page": 30}
            )
            commits_data = commits_response.json() if commits_response.status_code == 200 else []
            
            # Fetch README
            readme_response = await client.get(
                f"{self.BASE_URL}/repos/{owner}/{repo}/readme",
                headers=self.headers
            )
            readme_data = readme_response.json() if readme_response.status_code == 200 else None
            
            # Fetch issues (to check for good first issues)
            issues_response = await client.get(
                f"{self.BASE_URL}/repos/{owner}/{repo}/issues",
                headers=self.headers,
                params={"state": "open", "labels": "good first issue,beginner,help wanted", "per_page": 10}
            )
            issues_data = issues_response.json() if issues_response.status_code == 200 else []
            
            # Fetch contributing guidelines
            contributing_response = await client.get(
                f"{self.BASE_URL}/repos/{owner}/{repo}/contents/CONTRIBUTING.md",
                headers=self.headers
            )
            has_contributing = contributing_response.status_code == 200
            
            # Fetch code of conduct
            coc_response = await client.get(
                f"{self.BASE_URL}/repos/{owner}/{repo}/contents/CODE_OF_CONDUCT.md",
                headers=self.headers
            )
            has_coc = coc_response.status_code == 200
            
            return {
                "repo": repo_data,
                "commits": commits_data,
                "readme": readme_data,
                "issues": issues_data,
                "has_contributing": has_contributing,
                "has_code_of_conduct": has_coc,
            }


class RepoAnalyzer:
    """AI-powered repository analyzer using Claude"""
    
    def __init__(self, claude_client: anthropic.Anthropic):
        self.claude = claude_client
    
    def check_recent_activity(self, commits: List[Dict]) -> tuple[bool, str]:
        """Check if repository has been active in the last couple of months"""
        if not commits:
            return False, "No recent commits found"
        
        # Check last commit date
        last_commit_date_str = commits[0]["commit"]["author"]["date"]
        last_commit_date = datetime.strptime(last_commit_date_str, "%Y-%m-%dT%H:%M:%SZ")
        
        two_months_ago = datetime.now() - timedelta(days=60)
        
        # Count commits in last 2 months
        recent_commits = [
            c for c in commits
            if datetime.strptime(c["commit"]["author"]["date"], "%Y-%m-%dT%H:%M:%SZ") > two_months_ago
        ]
        
        is_active = len(recent_commits) > 0
        activity_msg = f"Last commit: {last_commit_date.strftime('%Y-%m-%d')}. {len(recent_commits)} commits in last 2 months."
        
        return is_active, activity_msg
    
    async def analyze_with_claude(self, github_data: Dict[str, Any]) -> Dict[str, Any]:
        """Use Claude to analyze repository for junior-friendliness"""
        
        repo = github_data["repo"]
        commits = github_data["commits"]
        issues = github_data["issues"]
        
        # Build context for Claude
        analysis_prompt = f"""You are an expert at evaluating GitHub repositories for junior developer friendliness. 
Analyze the following repository and determine if it's suitable for a junior developer to contribute to.

Repository Information:
- Name: {repo['full_name']}
- Description: {repo.get('description', 'No description')}
- Stars: {repo['stargazers_count']}
- Forks: {repo['forks_count']}
- Open Issues: {repo['open_issues_count']}
- Language: {repo.get('language', 'Not specified')}
- Has Contributing Guidelines: {github_data['has_contributing']}
- Has Code of Conduct: {github_data['has_code_of_conduct']}
- License: {repo.get('license', {}).get('name', 'No license') if repo.get('license') else 'No license'}

Recent Activity:
- Total recent commits analyzed: {len(commits)}
- Good First Issues Available: {len(issues)}

Good First Issues:
{self._format_issues(issues)}

Based on this information, evaluate:
1. Is this repository junior-friendly? (Consider documentation, issue labeling, community guidelines, complexity)
2. What makes it suitable or unsuitable for juniors?
3. What specific areas could a junior developer contribute to?
4. What should they be aware of before contributing?

Provide your analysis in the following JSON format:
{{
    "is_junior_friendly": true/false,
    "confidence_score": 0-100,
    "summary": "Brief 2-3 sentence summary",
    "strengths": ["list of strengths for junior developers"],
    "concerns": ["list of concerns or challenges"],
    "good_first_areas": ["specific areas to contribute"],
    "prerequisites": ["skills or knowledge needed"],
    "recommendations": ["actionable advice for junior developers"]
}}

Respond ONLY with valid JSON, no markdown formatting or additional text."""

        # Call Claude API
        message = self.claude.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            messages=[
                {"role": "user", "content": analysis_prompt}
            ]
        )
        
        # Parse Claude's response
        response_text = message.content[0].text
        
        # Clean up response (remove markdown code blocks if present)
        response_text = response_text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        response_text = response_text.strip()
        
        # Parse JSON
        import json
        analysis = json.loads(response_text)
        
        return analysis
    
    def _format_issues(self, issues: List[Dict]) -> str:
        """Format issues list for Claude prompt"""
        if not issues:
            return "No good first issues found"
        
        formatted = []
        for issue in issues[:5]:  # Limit to 5 issues
            formatted.append(f"- {issue['title']} (#{issue['number']})")
        
        return "\n".join(formatted)


# API Endpoints

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Junior Repo Analyzer API",
        "version": "1.0.0"
    }


@app.post("/api/analyze", response_model=RepoAnalysisResponse)
async def analyze_repository(request: RepoAnalysisRequest):
    """
    Analyze a GitHub repository for junior developer friendliness
    
    Args:
        request: RepoAnalysisRequest containing repo_url and optional github_token
    
    Returns:
        RepoAnalysisResponse with analysis results
    """
    try:
        # Initialize GitHub API client
        github_api = GitHubAPI(request.github_token)
        
        # Parse repository URL
        owner, repo = github_api.parse_repo_url(request.repo_url)
        
        # Fetch repository data
        github_data = await github_api.get_repo_data(owner, repo)
        
        # Initialize analyzer
        analyzer = RepoAnalyzer(claude_client)
        
        # Check recent activity
        is_active, activity_msg = analyzer.check_recent_activity(github_data["commits"])
        
        # Analyze with Claude
        claude_analysis = await analyzer.analyze_with_claude(github_data)
        
        # Build response
        return RepoAnalysisResponse(
            is_junior_friendly=claude_analysis["is_junior_friendly"],
            is_recently_active=is_active,
            confidence_score=claude_analysis["confidence_score"],
            summary=claude_analysis["summary"],
            detailed_analysis={
                "strengths": claude_analysis["strengths"],
                "concerns": claude_analysis["concerns"],
                "good_first_areas": claude_analysis["good_first_areas"],
                "prerequisites": claude_analysis["prerequisites"],
                "activity_info": activity_msg,
                "repo_stats": {
                    "stars": github_data["repo"]["stargazers_count"],
                    "forks": github_data["repo"]["forks_count"],
                    "open_issues": github_data["repo"]["open_issues_count"],
                    "language": github_data["repo"].get("language"),
                }
            },
            recommendations=claude_analysis["recommendations"]
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000)) 
    uvicorn.run(app, host="0.0.0.0", port=port)