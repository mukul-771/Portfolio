import { getAuthToken } from '../firebase/services/authService';
import type { Project } from '../types/project';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// Helper function to get auth headers
const getAuthHeaders = async () => {
  const token = await getAuthToken();
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
  
  // Create a new project
  create: async (project: Omit<Project, 'id'>) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers,
      body: JSON.stringify(project)
    });
    return handleResponse(response);
  },
  
  // Update a project
  update: async (id: string, project: Partial<Project>) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(project)
    });
    return handleResponse(response);
  },
  
  // Delete a project
  delete: async (id: string) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
      headers
    });
    return handleResponse(response);
  },
  
  // Upload project image
  uploadImage: async (file: File) => {
    const headers = await getAuthHeaders();
    // Remove Content-Type so that the browser can set it with the correct boundary for multipart/form-data
    delete headers['Content-Type'];
    
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_URL}/projects/upload`, {
      method: 'POST',
      headers: {
        'Authorization': headers.Authorization
      },
      body: formData
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
    return handleResponse(response);
  },
  
  // Verify token
  verifyToken: async () => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/auth/verify`, {
      headers
    });
    return handleResponse(response);
  }
};
