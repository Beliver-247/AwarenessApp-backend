const express = require('express');
const { body } = require('express-validator');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getChallenges,
  getChallenge,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  joinChallenge,
  leaveChallenge,
  completeChallenge
} = require('../controllers/challengeController');

const router = express.Router();

// Validation rules
const challengeValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('startDate')
    .isISO8601()
    .withMessage('Please provide a valid start date'),
  body('endDate')
    .isISO8601()
    .withMessage('Please provide a valid end date'),
  body('category')
    .isIn(['daily', 'weekly', 'monthly', 'seasonal', 'annual'])
    .withMessage('Invalid category'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Invalid difficulty level'),
  body('pointsReward')
    .isInt({ min: 1 })
    .withMessage('Points reward must be a positive integer'),
  body('maxParticipants')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max participants must be a positive integer'),
  body('requirements')
    .optional()
    .isArray()
    .withMessage('Requirements must be an array')
];

// Public routes
router.get('/', getChallenges);
router.get('/:id', getChallenge);

// Protected routes
router.post('/', authMiddleware, challengeValidation, createChallenge);
router.put('/:id', authMiddleware, challengeValidation, updateChallenge);
router.delete('/:id', authMiddleware, deleteChallenge);
router.post('/:id/join', authMiddleware, joinChallenge);
router.post('/:id/leave', authMiddleware, leaveChallenge);
router.post('/:id/complete', authMiddleware, completeChallenge);

module.exports = router;


