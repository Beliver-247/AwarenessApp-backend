const express = require('express');
const { authMiddleware, optionalAuth } = require('../middleware/authMiddleware');
const {
  getFeed,
  getPersonalizedFeed
} = require('../controllers/feedController');

const router = express.Router();

// Public routes (with optional auth for personalization)
router.get('/', optionalAuth, getFeed);

// Protected routes
router.get('/personalized', authMiddleware, getPersonalizedFeed);

module.exports = router;


