const express = require('express');
const router = express.Router();
const authController = require('../controllers/jsonAuthController');
const jwtAuthMiddleware = require('../middleware/jwtAuth');

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authController.login);

// @route   GET /api/auth/verify
// @desc    Verify user token
// @access  Private
router.get('/verify', jwtAuthMiddleware, authController.verifyToken);



module.exports = router;
