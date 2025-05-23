import type { Project, GlobalImageSettings } from '../types/project';

// Use proxy in development, full URL in production
const API_URL = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5001/api');

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Project API calls
export const projectApi = {
  // Get all projects
  getAll: async () => {
    const response = await fetch(`${API_URL}/projects`);
    return handleResponse(response);
  },

  // Get project by ID
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/projects/${id}`);
    return handleResponse(response);
  },

  // Get projects by category
  getByCategory: async (category: string) => {
    const response = await fetch(`${API_URL}/projects/category/${category}`);
    return handleResponse(response);
  },

  // Get recent projects with optional limit
  getRecent: async (limit: number = 6) => {
    const response = await fetch(`${API_URL}/projects/recent/${limit}`);
    return handleResponse(response);
  },

  // Get featured projects
  getFeatured: async () => {
    const response = await fetch(`${API_URL}/projects/featured`);
    return handleResponse(response);
  },

  // Create a new project
  create: async (project: Omit<Project, 'id'>) => {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers,
      body: JSON.stringify(project)
    });
    return handleResponse(response);
  },

  // Update a project
  update: async (id: string, project: Partial<Project>) => {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(project)
    });
    return handleResponse(response);
  },

  // Delete a project
  delete: async (id: string) => {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
      headers
    });
    return handleResponse(response);
  },

  // Upload project image
  uploadImage: async (file: File) => {
    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/projects/upload`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: formData
    });
    return handleResponse(response);
  }
};

// Global Settings API calls
export const globalSettingsApi = {
  // Get global image settings
  getImageSettings: async () => {
    const response = await fetch(`${API_URL}/settings/images`);
    return handleResponse(response);
  },

  // Update global image settings
  updateImageSettings: async (settings: GlobalImageSettings) => {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_URL}/settings/images`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(settings)
    });
    return handleResponse(response);
  },

  // Reset global image settings to defaults
  resetImageSettings: async () => {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_URL}/settings/images/reset`, {
      method: 'POST',
      headers
    });
    return handleResponse(response);
  }
};

// Contact API calls
export const contactApi = {
  // Submit contact form
  submit: async (formData: { name: string; email: string; subject: string; message: string }) => {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    return handleResponse(response);
  }
};

// Auth API calls
export const authApi = {
  // Login
  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    const data = await handleResponse(response);

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return Promise.resolve();
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Verify token
  verifyToken: async () => {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_URL}/auth/verify`, {
      headers
    });
    return handleResponse(response);
  },


};
