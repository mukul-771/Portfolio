const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '../db/projects.json');

// Default global image settings
const DEFAULT_GLOBAL_SETTINGS = {
  defaultThumbnailSettings: {
    aspectRatio: '4:3',
    fitBehavior: 'cover',
    width: 300,
    height: 225,
    scale: 100,
    lockAspectRatio: true
  },
  defaultHeroSettings: {
    aspectRatio: '16:9',
    fitBehavior: 'cover',
    width: 800,
    height: 450,
    scale: 100,
    lockAspectRatio: true
  },
  defaultGallerySettings: {
    aspectRatio: 'original',
    fitBehavior: 'contain',
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

// Helper function to read the JSON database
const readDatabase = async () => {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    const parsed = JSON.parse(data);

    // Ensure globalImageSettings exists
    if (!parsed.globalImageSettings) {
      parsed.globalImageSettings = DEFAULT_GLOBAL_SETTINGS;
    }

    return parsed;
  } catch (error) {
    console.error('Error reading database:', error);
    // Return default structure if file doesn't exist
    return {
      projects: [],
      users: [],
      globalImageSettings: DEFAULT_GLOBAL_SETTINGS
    };
  }
};

// Helper function to write to the JSON database
const writeDatabase = async (data) => {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
};

// Generate unique ID
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Project operations
const projectService = {
  // Get all projects
  getAll: async () => {
    const db = await readDatabase();
    return db.projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // Get project by ID
  getById: async (id) => {
    const db = await readDatabase();
    return db.projects.find(project => project.id === id);
  },

  // Get projects by category
  getByCategory: async (category) => {
    const db = await readDatabase();
    return db.projects
      .filter(project => project.category === category)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // Get recent projects with limit
  getRecent: async (limit = 6) => {
    const db = await readDatabase();
    return db.projects
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  },

  // Get featured projects
  getFeatured: async () => {
    const db = await readDatabase();
    return db.projects
      .filter(project => project.featured === true)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // Create a new project
  create: async (projectData) => {
    const db = await readDatabase();
    const newProject = {
      ...projectData,
      id: generateId(),
      createdAt: new Date().toISOString()
    };

    db.projects.push(newProject);
    const success = await writeDatabase(db);

    if (success) {
      return newProject;
    } else {
      throw new Error('Failed to save project');
    }
  },

  // Update a project
  update: async (id, updateData) => {
    const db = await readDatabase();
    const projectIndex = db.projects.findIndex(project => project.id === id);

    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    db.projects[projectIndex] = {
      ...db.projects[projectIndex],
      ...updateData,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    const success = await writeDatabase(db);

    if (success) {
      return db.projects[projectIndex];
    } else {
      throw new Error('Failed to update project');
    }
  },

  // Delete a project
  delete: async (id) => {
    const db = await readDatabase();
    const projectIndex = db.projects.findIndex(project => project.id === id);

    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    db.projects.splice(projectIndex, 1);
    const success = await writeDatabase(db);

    if (success) {
      return true;
    } else {
      throw new Error('Failed to delete project');
    }
  }
};

// User operations
const userService = {
  // Find user by email
  findByEmail: async (email) => {
    const db = await readDatabase();
    return db.users.find(user => user.email === email);
  },

  // Create a new user
  create: async (userData) => {
    const db = await readDatabase();

    // Check if user already exists
    const existingUser = db.users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = {
      id: generateId(),
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'admin',
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    const success = await writeDatabase(db);

    if (success) {
      // Return user without password
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } else {
      throw new Error('Failed to create user');
    }
  },

  // Verify password
  verifyPassword: async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
};

// Global settings operations
const globalSettingsService = {
  // Get global image settings
  getImageSettings: async () => {
    const db = await readDatabase();
    return db.globalImageSettings || DEFAULT_GLOBAL_SETTINGS;
  },

  // Update global image settings
  updateImageSettings: async (settingsData) => {
    const db = await readDatabase();

    db.globalImageSettings = {
      ...DEFAULT_GLOBAL_SETTINGS,
      ...settingsData,
      updatedAt: new Date().toISOString()
    };

    const success = await writeDatabase(db);

    if (success) {
      return db.globalImageSettings;
    } else {
      throw new Error('Failed to update global image settings');
    }
  },

  // Reset global image settings to defaults
  resetImageSettings: async () => {
    const db = await readDatabase();

    db.globalImageSettings = {
      ...DEFAULT_GLOBAL_SETTINGS,
      updatedAt: new Date().toISOString()
    };

    const success = await writeDatabase(db);

    if (success) {
      return db.globalImageSettings;
    } else {
      throw new Error('Failed to reset global image settings');
    }
  }
};

module.exports = {
  projectService,
  userService,
  globalSettingsService
};
