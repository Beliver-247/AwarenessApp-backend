const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getEventRecommendationsForUser,
  getChallengeRecommendationsForUser,
  getGeneralRecommendations
} = require('../controllers/recommendationController');

const router = express.Router();

// All recommendation routes require authentication
router.get('/', authMiddleware, getGeneralRecommendations);
router.get('/events', authMiddleware, getEventRecommendationsForUser);
router.get('/challenges', authMiddleware, getChallengeRecommendationsForUser);

module.exports = router;


