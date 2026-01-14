# 🚀 Junior Repo Analyzer

An AI-powered tool that helps junior developers find GitHub repositories perfect for their first open-source contributions.

<!-- [![Live Demo](https://img.shields.io/badge/demo-live-success)](https://your-app.vercel.app)

![Junior Repo Analyzer Demo](https://via.placeholder.com/800x400?text=Add+Screenshot+Here) -->

## 🎯 What It Does

Paste any GitHub repository URL and get instant AI-powered analysis:

✅ **Junior-Friendly Score** - Is it good for beginners?  
✅ **Activity Check** - Recent commits in last 2 months  
✅ **Documentation Quality** - README, CONTRIBUTING.md, good first issues  
✅ **Tech Stack Analysis** - What skills you'll need  
✅ **Actionable Recommendations** - Where to start contributing

## 🌟 Features

- **AI-Powered Analysis** using Claude Sonnet 4
- **GitHub API Integration** for real-time repository data
- **Beautiful, Responsive UI** with smooth animations
- **Instant Results** in 10-15 seconds
- **Comprehensive Reports** with strengths, concerns, and recommendations

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React Icons

**Backend:**
- Python 3.11+
- FastAPI
- Anthropic Claude API
- GitHub REST API
- Async/await for optimal performance

## 🚀 Live Demo

**Try it here:** [https://junior-repo-analyzer-agent.vercel.app/](https://junior-repo-analyzer-agent.vercel.app/)

Example repositories to analyze:
- `facebook/react`
- `firstcontributions/first-contributions`
- `microsoft/vscode`

## 📸 Screenshots

<!-- ### Analysis Results
![Analysis Results](https://via.placeholder.com/600x400?text=Add+Results+Screenshot)

### Loading State
![Loading Animation](https://via.placeholder.com/600x400?text=Add+Loading+Screenshot) -->

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Anthropic API Key ([Get one free](https://console.anthropic.com/))
- GitHub Token (optional, for higher rate limits)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/junior-repo-analyzer.git
cd junior-repo-analyzer
```

**2. Set up the backend**
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate 

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

**3. Set up the frontend**
```bash
cd ../frontend

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

**4. Run the application**

**Terminal 1 (Backend):**
```bash
cd backend
source venv/bin/activate
python main.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

**5. Open your browser**
```
http://localhost:3000
```

## 🌐 Deployment

### Deploy Backend to Railway

1. Push your code to GitHub
2. Create a [Railway](https://railway.app) account
3. Create new project → Deploy from GitHub
4. Set root directory to `backend`
5. Add environment variables:
   - `ANTHROPIC_API_KEY`
   - `GITHUB_TOKEN` (optional)
6. Deploy!

### Deploy Frontend to Vercel

1. Push your code to GitHub
2. Create a [Vercel](https://vercel.com) account
3. Import your GitHub repository
4. Set root directory to `frontend`
5. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your Railway backend URL
6. Deploy!

## 📚 Project Structure
```
junior-repo-analyzer/
├── backend/               # Python FastAPI backend
│   ├── main.py           # Main application & AI agent
│   └── requirements.txt  # Python dependencies
│
├── frontend/             # Next.js frontend
│   ├── app/             # Next.js app directory
│   │   ├── page.tsx     # Main page
│   │   ├── layout.tsx   # Root layout
│   │   └── globals.css  # Global styles
│   ├── components/      # React components
│   │   ├── RepoInputForm.tsx
│   │   ├── AnalysisResults.tsx
│   │   ├── LoadingState.tsx
│   │   └── ErrorDisplay.tsx
│   ├── lib/            # Utilities
│   │   └── api.ts      # API client
│   └── types/          # TypeScript types
│       └── index.ts
│
└── README.md
```

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```bash
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
GITHUB_TOKEN=ghp_your-token-here  # Optional
```

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000  # or your Railway URL
```

## 🧪 How It Works

1. **User Input** - Paste a GitHub repository URL
2. **Data Gathering** - Fetches repo metadata, commits, issues, documentation
3. **Activity Check** - Analyzes commits from the last 60 days
4. **AI Analysis** - Claude evaluates junior-friendliness based on multiple factors
5. **Results** - Displays comprehensive analysis with recommendations

## 🤖 AI Agent Architecture

The AI agent follows a structured analysis pipeline:

1. **Context Building** - Gathers repository data from GitHub API
2. **Prompt Engineering** - Creates detailed analysis prompt with structured output
3. **Claude Analysis** - Uses Claude Sonnet 4 for intelligent evaluation
4. **Response Parsing** - Extracts structured JSON from AI response
5. **Result Formatting** - Presents findings in user-friendly format

## 📊 API Endpoints

### `GET /`
Health check endpoint
```json
{
  "status": "healthy",
  "service": "Junior Repo Analyzer API",
  "version": "1.0.0"
}
```

### `POST /api/analyze`
Analyze a GitHub repository

**Request:**
```json
{
  "repo_url": "https://github.com/owner/repo",
  "github_token": "optional_token"
}
```

**Response:**
```json
{
  "is_junior_friendly": true,
  "is_recently_active": true,
  "confidence_score": 85,
  "summary": "This repository shows strong indicators...",
  "detailed_analysis": { ... },
  "recommendations": [ ... ]
}
```



## 🐛 Known Issues

- GitHub API rate limit: 60 requests/hour without token, 5000 with token
- Analysis takes 10-15 seconds (due to AI processing)
- Large repositories may take longer to analyze


## 🙏 Acknowledgments

- [Anthropic](https://anthropic.com) for Claude AI API
- [GitHub](https://github.com) for their comprehensive REST API
- [Vercel](https://vercel.com) for Next.js and hosting
- [Railway](https://railway.app) for backend hosting

## 📧 Contact

Mai Vang - [@MaiVangSWE](https://x.com/MaiVangSWE)

Project Link: [https://github.com/vmaineng/junior-repo-analyzer-agent](https://github.com/vmaineng/junior-repo-analyzer-agent)

---

**⭐ Star this repo if it helped you find your first open-source contribution!**

Made with ❤️ to help junior developers start their open-source journey