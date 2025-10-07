const express = require('express');
const { body } = require('express-validator');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getAchievements,
  getAchievement,
  getUserAchievements,
  getMyAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  awardAchievement
} = require('../controllers/achievementController');

const router = express.Router();

// Validation rules
const achievementValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('pointsRequired')
    .isInt({ min: 0 })
    .withMessage('Points required must be a non-negative integer'),
  body('badgeIcon')
    .trim()
    .notEmpty()
    .withMessage('Badge icon is required'),
  body('category')
    .isIn(['participation', 'leadership', 'environmental', 'community', 'milestone'])
    .withMessage('Invalid category'),
  body('rarity')
    .optional()
    .isIn(['common', 'uncommon', 'rare', 'epic', 'legendary'])
    .withMessage('Invalid rarity'),
  body('criteria')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Criteria cannot exceed 300 characters')
];

// Public routes
router.get('/', getAchievements);
router.get('/:id', getAchievement);
router.get('/user/:userId', getUserAchievements);

// Protected routes
router.get('/my/achievements', authMiddleware, getMyAchievements);
router.post('/', authMiddleware, achievementValidation, createAchievement);
router.put('/:id', authMiddleware, achievementValidation, updateAchievement);
router.delete('/:id', authMiddleware, deleteAchievement);
router.post('/:id/award/:userId', authMiddleware, awardAchievement);

module.exports = router;


