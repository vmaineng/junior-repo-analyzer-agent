import { RepoAnalysisRequest, RepoAnalysisResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public detail?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function analyzeRepository(
  request: RepoAnalysisRequest
): Promise<RepoAnalysisResponse> {
  console.log('🔵 Starting analysis request...');
  console.log('🔵 API_BASE_URL:', API_BASE_URL);
  console.log('🔵 Request:', request);
  
  try {
    console.log('🔵 Calling fetch...');
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    console.log('🔵 Response status:', response.status);
    console.log('🔵 Response ok:', response.ok);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('🔴 Error data:', errorData);
      throw new APIError(
        errorData.detail || 'Failed to analyze repository',
        response.status,
        errorData.detail
      );
    }

    console.log('🔵 Parsing response...');
    const data: RepoAnalysisResponse = await response.json();
    console.log('✅ Success! Data:', data);
    return data;
  } catch (error) {
    console.log('🔴 Caught error:', error);
    if (error instanceof APIError) {
      throw error;
    }
    
    // Network or other errors
    throw new APIError(
      'Failed to connect to the analysis service. Please check if the backend is running.',
      0
    );
  }
}