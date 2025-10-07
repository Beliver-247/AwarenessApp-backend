const express = require('express');
const { body } = require('express-validator');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getVolunteerOpportunities,
  getVolunteerOpportunity,
  createVolunteerOpportunity,
  updateVolunteerOpportunity,
  deleteVolunteerOpportunity,
  joinVolunteerOpportunity,
  leaveVolunteerOpportunity
} = require('../controllers/volunteerController');

const router = express.Router();

// Validation rules
const volunteerValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('role')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Role must be between 3 and 100 characters'),
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('location')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Location must be between 3 and 200 characters'),
  body('organization')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Organization must be between 2 and 100 characters'),
  body('timeCommitment')
    .isIn(['1-2 hours', 'Half day', 'Full day', 'Multiple days', 'Ongoing'])
    .withMessage('Invalid time commitment'),
  body('maxParticipants')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max participants must be a positive integer'),
  body('skillsRequired')
    .optional()
    .isArray()
    .withMessage('Skills required must be an array')
];

// Public routes
router.get('/', getVolunteerOpportunities);
router.get('/:id', getVolunteerOpportunity);

// Protected routes
router.post('/', authMiddleware, volunteerValidation, createVolunteerOpportunity);
router.put('/:id', authMiddleware, volunteerValidation, updateVolunteerOpportunity);
router.delete('/:id', authMiddleware, deleteVolunteerOpportunity);
router.post('/:id/join', authMiddleware, joinVolunteerOpportunity);
router.post('/:id/leave', authMiddleware, leaveVolunteerOpportunity);

module.exports = router;


