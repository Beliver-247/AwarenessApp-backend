const express = require('express');
const { body } = require('express-validator');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent
} = require('../controllers/eventController');

const router = express.Router();

// Validation rules
const eventValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('location')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Location must be between 3 and 200 characters'),
  body('maxParticipants')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max participants must be a positive integer'),
  body('category')
    .optional()
    .isIn(['cleanup', 'tree-planting', 'education', 'conservation', 'recycling', 'other'])
    .withMessage('Invalid category')
];

// Public routes
router.get('/', getEvents);
router.get('/:id', getEvent);

// Protected routes
router.post('/', authMiddleware, eventValidation, createEvent);
router.put('/:id', authMiddleware, eventValidation, updateEvent);
router.delete('/:id', authMiddleware, deleteEvent);
router.post('/:id/join', authMiddleware, joinEvent);
router.post('/:id/leave', authMiddleware, leaveEvent);

module.exports = router;


