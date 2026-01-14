// Type definitions for Junior Repo Analyzer

export interface RepoAnalysisRequest {
  repo_url: string;
  github_token?: string;
}

export interface RepoStats {
  stars: number;
  forks: number;
  open_issues: number;
  language: string | null;
}

export interface DetailedAnalysis {
  strengths: string[];
  concerns: string[];
  good_first_areas: string[];
  prerequisites: string[];
  activity_info: string;
  repo_stats: RepoStats;
}

export interface RepoAnalysisResponse {
  is_junior_friendly: boolean;
  is_recently_active: boolean;
  confidence_score: number;
  summary: string;
  detailed_analysis: DetailedAnalysis;
  recommendations: string[];
}

export type AnalysisStatus = 'idle' | 'loading' | 'success' | 'error';