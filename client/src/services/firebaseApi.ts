import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import { db, storage } from '../config/firebase';
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
      const projectsRef = collection(db, 'projects');
      const querySnapshot = await getDocs(query(projectsRef, orderBy('createdAt', 'desc')));

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
      })) as Project[];
    } catch (error) {
      handleFirebaseError(error);
      return [];
    }
  },

  // Get project by ID
  getById: async (id: string): Promise<Project | null> => {
    try {
      const projectRef = doc(db, 'projects', id);
      const projectSnap = await getDoc(projectRef);

      if (!projectSnap.exists()) {
        return null;
      }

      const data = projectSnap.data();
      return {
        id: projectSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
      } as Project;
    } catch (error) {
      handleFirebaseError(error);
      return null;
    }
  },

  // Get projects by category
  getByCategory: async (category: string): Promise<Project[]> => {
    try {
      const projectsRef = collection(db, 'projects');
      const q = query(
        projectsRef,
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
      })) as Project[];
    } catch (error) {
      handleFirebaseError(error);
      return [];
    }
  },

  // Get recent projects with optional limit
  getRecent: async (limitCount: number = 6): Promise<Project[]> => {
    try {
      const projectsRef = collection(db, 'projects');
      const q = query(
        projectsRef,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
      })) as Project[];
    } catch (error) {
      handleFirebaseError(error);
      return [];
    }
  },

  // Get featured projects
  getFeatured: async (): Promise<Project[]> => {
    try {
      const projectsRef = collection(db, 'projects');
      const q = query(
        projectsRef,
        where('featured', '==', true),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
      })) as Project[];
    } catch (error) {
      handleFirebaseError(error);
      return [];
    }
  },

  // Create a new project
  create: async (project: Omit<Project, 'id'>) => {
    try {
      const projectsRef = collection(db, 'projects');
      const now = Timestamp.now();

      const projectData = {
        ...project,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(projectsRef, projectData);

      return {
        id: docRef.id,
        ...project,
        createdAt: now.toDate().toISOString(),
        updatedAt: now.toDate().toISOString()
      };
    } catch (error) {
      handleFirebaseError(error);
    }
  },

  // Update a project
  update: async (id: string, project: Partial<Project>) => {
    try {
      const projectRef = doc(db, 'projects', id);
      const now = Timestamp.now();

      const updateData = {
        ...project,
        updatedAt: now
      };

      await updateDoc(projectRef, updateData);

      // Get the updated document
      const updatedDoc = await getDoc(projectRef);
      const data = updatedDoc.data();

      return {
        id: updatedDoc.id,
        ...data,
        createdAt: data?.createdAt?.toDate?.()?.toISOString() || data?.createdAt,
        updatedAt: data?.updatedAt?.toDate?.()?.toISOString() || data?.updatedAt
      };
    } catch (error) {
      handleFirebaseError(error);
    }
  },

  // Delete a project
  delete: async (id: string) => {
    try {
      const projectRef = doc(db, 'projects', id);
      await deleteDoc(projectRef);
      return { success: true };
    } catch (error) {
      handleFirebaseError(error);
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
    const response = await fetch('/api/auth/login', {
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
    const response = await fetch('/api/auth/verify', {
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

// Global settings API calls using Firebase
export const globalSettingsApi = {
  getImageSettings: async () => {
    try {
      const settingsRef = doc(db, 'settings', 'globalImageSettings');
      const settingsSnap = await getDoc(settingsRef);

      if (!settingsSnap.exists()) {
        // Return default settings if none exist
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

      return settingsSnap.data();
    } catch (error) {
      handleFirebaseError(error);
    }
  },

  updateImageSettings: async (settings: GlobalImageSettings) => {
    try {
      const settingsRef = doc(db, 'settings', 'globalImageSettings');
      const now = Timestamp.now();

      const settingsData = {
        ...settings,
        updatedAt: now
      };

      await updateDoc(settingsRef, settingsData);

      return {
        ...settings,
        updatedAt: now.toDate().toISOString()
      };
    } catch (error) {
      handleFirebaseError(error);
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
