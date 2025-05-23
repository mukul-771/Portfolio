// Database utility for Vercel serverless functions using Firebase
const { getFirestore } = require('./firebase');
const bcrypt = require('bcryptjs');

// Get Firestore instance
const db = () => getFirestore();

// Project operations
const projectOperations = {
  // Get all projects
  getAll: async () => {
    try {
      const projectsRef = db().collection('projects');
      const snapshot = await projectsRef.orderBy('createdAt', 'desc').get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
      }));
    } catch (error) {
      console.error('Error getting projects:', error);
      throw error;
    }
  },

  // Get project by ID
  getById: async (id) => {
    try {
      const projectRef = db().collection('projects').doc(id);
      const doc = await projectRef.get();

      if (!doc.exists) {
        throw new Error('Project not found');
      }

      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
      };
    } catch (error) {
      console.error('Error getting project:', error);
      throw error;
    }
  },

  // Get projects by category
  getByCategory: async (category) => {
    try {
      const projectsRef = db().collection('projects');
      const snapshot = await projectsRef
        .where('category', '==', category)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
      }));
    } catch (error) {
      console.error('Error getting projects by category:', error);
      throw error;
    }
  },

  // Get featured projects
  getFeatured: async () => {
    try {
      const projectsRef = db().collection('projects');
      const snapshot = await projectsRef
        .where('featured', '==', true)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
      }));
    } catch (error) {
      console.error('Error getting featured projects:', error);
      throw error;
    }
  },

  // Get recent projects
  getRecent: async (limit = 6) => {
    try {
      const projectsRef = db().collection('projects');
      const snapshot = await projectsRef
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
      }));
    } catch (error) {
      console.error('Error getting recent projects:', error);
      throw error;
    }
  },

  // Create project
  create: async (projectData) => {
    try {
      const projectsRef = db().collection('projects');
      const now = new Date();

      const newProject = {
        ...projectData,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await projectsRef.add(newProject);

      return {
        id: docRef.id,
        ...newProject,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      };
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  // Update project
  update: async (id, updateData) => {
    try {
      const projectRef = db().collection('projects').doc(id);
      const now = new Date();

      const updatedData = {
        ...updateData,
        updatedAt: now
      };

      await projectRef.update(updatedData);

      // Get the updated document
      const doc = await projectRef.get();
      const data = doc.data();

      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
      };
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  // Delete project
  delete: async (id) => {
    try {
      const projectRef = db().collection('projects').doc(id);
      await projectRef.delete();
      return { success: true };
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
};

// User operations
const userOperations = {
  // Get user by email
  getByEmail: async (email) => {
    try {
      const usersRef = db().collection('users');
      const snapshot = await usersRef.where('email', '==', email).get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  },

  // Create user (for initial setup)
  create: async (userData) => {
    try {
      const usersRef = db().collection('users');

      // Check if user already exists
      const existingUser = await userOperations.getByEmail(userData.email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const newUser = {
        email: userData.email,
        password: hashedPassword,
        role: userData.role || 'admin',
        createdAt: new Date()
      };

      const docRef = await usersRef.add(newUser);

      // Return user without password
      const { password, ...userWithoutPassword } = newUser;
      return {
        id: docRef.id,
        ...userWithoutPassword
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Verify password
  verifyPassword: async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
};

// Global settings operations
const globalSettingsOperations = {
  // Get global image settings
  getImageSettings: async () => {
    try {
      const settingsRef = db().collection('settings').doc('globalImageSettings');
      const doc = await settingsRef.get();

      if (!doc.exists) {
        // Return default settings
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

      return doc.data();
    } catch (error) {
      console.error('Error getting global settings:', error);
      throw error;
    }
  },

  // Update global image settings
  updateImageSettings: async (settingsData) => {
    try {
      const settingsRef = db().collection('settings').doc('globalImageSettings');
      const now = new Date();

      const updatedSettings = {
        ...settingsData,
        updatedAt: now
      };

      await settingsRef.set(updatedSettings, { merge: true });

      return {
        ...updatedSettings,
        updatedAt: now.toISOString()
      };
    } catch (error) {
      console.error('Error updating global settings:', error);
      throw error;
    }
  }
};

module.exports = {
  projectOperations,
  userOperations,
  globalSettingsOperations
};
