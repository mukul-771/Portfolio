// API Configuration for deployment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    projects: '/api/projects',
    auth: '/api/auth',
    contact: '/api/contact',
    settings: '/api/settings'
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${apiConfig.baseURL}${endpoint}`;
};

// Common API headers
export const getApiHeaders = (includeAuth = false): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// API fetch wrapper with error handling
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
  includeAuth = false
): Promise<Response> => {
  const url = buildApiUrl(endpoint);
  const headers = getApiHeaders(includeAuth);

  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    return response;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};
