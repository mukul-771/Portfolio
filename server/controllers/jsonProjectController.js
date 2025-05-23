const { projectService } = require('../services/jsonDataService');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Configure multer for file uploads to local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/images');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await projectService.getAll();
    res.json(projects);
  } catch (err) {
    console.error('Error getting projects:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await projectService.getById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    console.error('Error getting project by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get projects by category
exports.getProjectsByCategory = async (req, res) => {
  try {
    const projects = await projectService.getByCategory(req.params.category);
    res.json(projects);
  } catch (err) {
    console.error('Error getting projects by category:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get recent projects with optional limit
exports.getRecentProjects = async (req, res) => {
  try {
    const limit = req.params.limit ? parseInt(req.params.limit) : 6; // Default to 6 if no limit specified
    const projects = await projectService.getRecent(limit);
    res.json(projects);
  } catch (err) {
    console.error('Error getting recent projects:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get featured projects
exports.getFeaturedProjects = async (req, res) => {
  try {
    const projects = await projectService.getFeatured();
    res.json(projects);
  } catch (err) {
    console.error('Error getting featured projects:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const newProject = await projectService.create(req.body);
    res.status(201).json(newProject);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  try {
    const updatedProject = await projectService.update(req.params.id, req.body);
    res.json(updatedProject);
  } catch (err) {
    console.error('Error updating project:', err);
    if (err.message === 'Project not found') {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    await projectService.delete(req.params.id);
    res.json({ message: 'Project removed' });
  } catch (err) {
    console.error('Error deleting project:', err);
    if (err.message === 'Project not found') {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// Upload project image
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Create the public URL for the uploaded image
    const imageUrl = `/uploads/images/${req.file.filename}`;

    res.json({ imageUrl });
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export the multer upload middleware
exports.uploadMiddleware = upload;
