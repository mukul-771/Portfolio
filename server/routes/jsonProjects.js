const express = require('express');
const router = express.Router();
const projectController = require('../controllers/jsonProjectController');
const jwtAuthMiddleware = require('../middleware/jwtAuth');

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', projectController.getProjects);

// @route   GET /api/projects/featured
// @desc    Get featured projects
// @access  Public
router.get('/featured', projectController.getFeaturedProjects);

// @route   GET /api/projects/category/:category
// @desc    Get projects by category
// @access  Public
router.get('/category/:category', projectController.getProjectsByCategory);

// @route   GET /api/projects/recent/:limit
// @desc    Get recent projects with limit
// @access  Public
router.get('/recent/:limit', projectController.getRecentProjects);

// @route   GET /api/projects/recent
// @desc    Get recent projects with default limit
// @access  Public
router.get('/recent', projectController.getRecentProjects);

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Public
router.get('/:id', projectController.getProjectById);

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private
router.post('/', jwtAuthMiddleware, projectController.createProject);

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', jwtAuthMiddleware, projectController.updateProject);

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', jwtAuthMiddleware, projectController.deleteProject);

// @route   POST /api/projects/upload
// @desc    Upload project image
// @access  Private
router.post('/upload', jwtAuthMiddleware, projectController.uploadMiddleware.single('image'), projectController.uploadImage);

module.exports = router;
