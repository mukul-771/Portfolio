const express = require('express');
const router = express.Router();
const { getImageSettings, updateImageSettings, resetImageSettings } = require('../controllers/globalSettingsController');
const authenticateToken = require('../middleware/jwtAuth');

// @route   GET /api/settings/images
// @desc    Get global image settings
// @access  Public (for now, can be restricted later)
router.get('/images', getImageSettings);

// @route   PUT /api/settings/images
// @desc    Update global image settings
// @access  Private (Admin only)
router.put('/images', authenticateToken, updateImageSettings);

// @route   POST /api/settings/images/reset
// @desc    Reset global image settings to defaults
// @access  Private (Admin only)
router.post('/images/reset', authenticateToken, resetImageSettings);

module.exports = router;
