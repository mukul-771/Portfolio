const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Mock data for demo purposes
const mockContacts = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Project Inquiry',
    message: 'I would like to discuss a potential project with you.',
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    subject: 'Collaboration Opportunity',
    message: 'I have a collaboration opportunity that might interest you.',
    createdAt: new Date()
  }
];

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', contactController.submitContact);

// @route   GET /api/contact
// @desc    Get all contact submissions (admin only)
// @access  Private (would require auth middleware in production)
router.get('/', contactController.getContacts);

module.exports = router;
