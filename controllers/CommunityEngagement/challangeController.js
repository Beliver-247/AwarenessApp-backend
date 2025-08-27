// src/controllers/challengeController.js

const Challenge = require('../../models/CommunityEngagement/Challange');
const User = require('../../models/CommunityEngagement/User');
const asyncHandler = require('express-async-handler');

// @desc    Get all challenges
// @route   GET /api/challenges
// @access  Public
const getChallenges = asyncHandler(async (req, res) => {
  const challenges = await Challenge.find({});
  res.json(challenges);
});

// @desc    Get single challenge details
// @route   GET /api/challenges/:id
// @access  Public
const getChallengeById = asyncHandler(async (req, res) => {
  const challenge = await Challenge.findById(req.params.id).populate('participants', 'name email');

  if (challenge) {
    res.json(challenge);
  } else {
    res.status(404);
    throw new Error('Challenge not found');
  }
});

// @desc    User joins a challenge
// @route   POST /api/challenges/:id/join
// @access  Private
const joinChallenge = asyncHandler(async (req, res) => {
  const challenge = await Challenge.findById(req.params.id);
  const user = await User.findById(req.user._id);

  if (challenge && user) {
    // Check if the user has already joined
    if (challenge.participants.includes(user._id)) {
      res.status(400);
      throw new Error('You have already joined this challenge');
    }

    challenge.participants.push(user._id);
    user.joinedChallenges.push(challenge._id);

    await challenge.save();
    await user.save();

    res.status(200).json({
      message: 'Successfully joined the challenge',
      challenge: challenge,
    });
  } else {
    res.status(404);
    throw new Error('Challenge or User not found');
  }
});

module.exports = {
  getChallenges,
  getChallengeById,
  joinChallenge,
};