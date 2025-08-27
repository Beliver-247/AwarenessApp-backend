// src/controllers/achievementController.js

const Achievement = require('../../models/CommunityEngagement/Achievement');
const User = require('../../models/CommunityEngagement/User');
const asyncHandler = require('express-async-handler');

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
const getAchievements = asyncHandler(async (req, res) => {
  const achievements = await Achievement.find({});
  res.json(achievements);
});

// @desc    Get leaderboard (ranked by points)
// @route   GET /api/leaderboard
// @access  Public
const getLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await User.find({})
    .sort({ points: -1 }) // Sort in descending order of points
    .select('name points group') // Select the fields to be returned
    .limit(50); // Limit the leaderboard to the top 50 users

  res.json(leaderboard);
});

// @desc    Award achievement to a user (internal use)
// @route   POST /api/achievements/award/:userId
// @access  Private (e.g., used by another internal service or after an event completion)
const awardAchievement = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  const { achievementId } = req.body;

  if (user) {
    const achievement = await Achievement.findById(achievementId);
    if (!achievement) {
      res.status(404);
      throw new Error('Achievement not found');
    }

    // Check if user already has this achievement
    if (user.achievements.includes(achievementId)) {
      res.status(400);
      throw new Error('User already has this achievement');
    }

    user.achievements.push(achievementId);
    await user.save();

    res.json({
      message: 'Achievement awarded successfully',
      user: user,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  getAchievements,
  getLeaderboard,
  awardAchievement,
};