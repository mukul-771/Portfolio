import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import { storage } from '../config/firebase';
import type { Project, GlobalImageSettings } from '../types/project';

// Helper function to handle API responses
const handleFirebaseError = (error: any) => {
  console.error('Firebase error:', error);
  throw new Error(error.message || 'Something went wrong');
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Project API calls using Firebase
export const projectApi = {
  // Get all projects
  getAll: async (): Promise<Project[]> => {
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  // Get project by ID
  getById: async (id: string): Promise<Project | null> => {
    try {
      const response = await fetch(`/api/projects?id=${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch project');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  },

  // Get projects by category
  getByCategory: async (category: string): Promise<Project[]> => {
    try {
      const response = await fetch(`/api/projects?type=category&category=${category}`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects by category');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching projects by category:', error);
      return [];
    }
  },

  // Get recent projects with optional limit
  getRecent: async (limitCount: number = 6): Promise<Project[]> => {
    try {
      const response = await fetch(`/api/projects?type=recent&limit=${limitCount}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recent projects');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching recent projects:', error);
      return [];
    }
  },

  // Get featured projects
  getFeatured: async (): Promise<Project[]> => {
    try {
      const response = await fetch('/api/projects?type=featured');
      if (!response.ok) {
        throw new Error('Failed to fetch featured projects');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured projects:', error);
      return [];
    }
  },

  // Create a new project
  create: async (project: Omit<Project, 'id'>): Promise<Project | null> => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(project)
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  },

  // Update a project
  update: async (id: string, project: Partial<Project>): Promise<Project | null> => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(project)
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to update project');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating project:', error);
      return null;
    }
  },

  // Delete a project
  delete: async (id: string) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      return { success: true };
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  // Upload project image to Firebase Storage
  uploadImage: async (file: File) => {
    try {
      // Create a unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2);
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}-${randomString}.${fileExtension}`;

      // Create storage reference
      const storageRef = ref(storage, `project-images/${fileName}`);

      // Upload file
      const snapshot = await uploadBytes(storageRef, file);

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      return {
        imageUrl: downloadURL,
        fileName: fileName,
        message: 'Image uploaded successfully'
      };
    } catch (error) {
      handleFirebaseError(error);
    }
  }
};

// Auth API calls (still using your existing JWT system)
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    return data;
  },

  verify: async () => {
    const headers = getAuthHeaders();
    const response = await fetch('/api/auth?action=verify', {
      method: 'GET',
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Token verification failed');
    }

    return data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  verifyToken: async () => {
    try {
      await authApi.verify();
      return true;
    } catch {
      return false;
    }
  }
};

// Global settings API calls
export const globalSettingsApi = {
  getImageSettings: async () => {
    try {
      const response = await fetch('/api/settings/images');
      if (!response.ok) {
        // Return default settings if API call fails
        return {
          defaultThumbnailSettings: {
            aspectRatio: "4:3",
            fitBehavior: "cover",
            width: 300,
            height: 225,
            scale: 100,
            lockAspectRatio: true
          },
          defaultHeroSettings: {
            aspectRatio: "16:9",
            fitBehavior: "cover",
            width: 800,
            height: 450,
            scale: 100,
            lockAspectRatio: true
          },
          defaultGallerySettings: {
            aspectRatio: "original",
            fitBehavior: "contain",
            width: 600,
            height: 400,
            scale: 100,
            lockAspectRatio: true
          },
          responsiveBreakpoints: {
            mobile: 375,
            tablet: 768,
            desktop: 1200
          }
        };
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching image settings:', error);
      return null;
    }
  },

  updateImageSettings: async (settings: GlobalImageSettings) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch('/api/settings/images', {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Failed to update image settings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating image settings:', error);
      throw error;
    }
  }
};

// Contact API (still using your existing email system)
export const contactApi = {
  send: async (contactData: any) => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send message');
    }

    return data;
  },

  submit: async (contactData: any) => {
    return await contactApi.send(contactData);
  }
};
