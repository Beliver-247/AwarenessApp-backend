// src/routes/achievementRoutes.js

const express = require('express');
const router = express.Router();
const {
  getAchievements,
  getLeaderboard,
  awardAchievement,
} = require('../../controllers/CommunityEngagement/achievementController');
const { protect } = require('../../middleware/authMiddleware');

router.get('/', getAchievements);
router.get('/leaderboard', getLeaderboard);
router.post('/award/:userId', protect, awardAchievement);

module.exports = router;