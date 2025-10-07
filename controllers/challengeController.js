const { validationResult } = require('express-validator');
const Challenge = require('../models/Challenge');
const User = require('../models/User');

// @desc    Get all challenges
// @route   GET /api/challenges
// @access  Public
const getChallenges = async (req, res) => {
  try {
    const { category, difficulty, page = 1, limit = 10, active = true } = req.query;
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (active === 'true') {
      query.startDate = { $lte: new Date() };
      query.endDate = { $gte: new Date() };
    }

    const challenges = await Challenge.find(query)
      .populate('organizer', 'name')
      .populate('participants', 'name')
      .sort({ startDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Challenge.countDocuments(query);

    res.json({
      success: true,
      data: {
        challenges,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching challenges'
    });
  }
};

// @desc    Get single challenge
// @route   GET /api/challenges/:id
// @access  Public
const getChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('participants', 'name');

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    res.json({
      success: true,
      data: { challenge }
    });
  } catch (error) {
    console.error('Get challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching challenge'
    });
  }
};

// @desc    Create new challenge
// @route   POST /api/challenges
// @access  Private
const createChallenge = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      title,
      description,
      startDate,
      endDate,
      category,
      difficulty,
      pointsReward,
      requirements,
      maxParticipants
    } = req.body;

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    const challenge = await Challenge.create({
      title,
      description,
      startDate,
      endDate,
      category,
      difficulty,
      pointsReward,
      requirements: requirements || [],
      maxParticipants,
      organizer: req.user._id
    });

    const populatedChallenge = await Challenge.findById(challenge._id)
      .populate('organizer', 'name');

    res.status(201).json({
      success: true,
      message: 'Challenge created successfully',
      data: { challenge: populatedChallenge }
    });
  } catch (error) {
    console.error('Create challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating challenge'
    });
  }
};

// @desc    Update challenge
// @route   PUT /api/challenges/:id
// @access  Private
const updateChallenge = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    let challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    // Check if user is the organizer
    if (challenge.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this challenge'
      });
    }

    const {
      title,
      description,
      startDate,
      endDate,
      category,
      difficulty,
      pointsReward,
      requirements,
      maxParticipants
    } = req.body;

    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (startDate) updateData.startDate = startDate;
    if (endDate) updateData.endDate = endDate;
    if (category) updateData.category = category;
    if (difficulty) updateData.difficulty = difficulty;
    if (pointsReward) updateData.pointsReward = pointsReward;
    if (requirements) updateData.requirements = requirements;
    if (maxParticipants !== undefined) updateData.maxParticipants = maxParticipants;

    // Validate dates if both are provided
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('organizer', 'name');

    res.json({
      success: true,
      message: 'Challenge updated successfully',
      data: { challenge }
    });
  } catch (error) {
    console.error('Update challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating challenge'
    });
  }
};

// @desc    Delete challenge
// @route   DELETE /api/challenges/:id
// @access  Private
const deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    // Check if user is the organizer
    if (challenge.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this challenge'
      });
    }

    await Challenge.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({
      success: true,
      message: 'Challenge deleted successfully'
    });
  } catch (error) {
    console.error('Delete challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting challenge'
    });
  }
};

// @desc    Join challenge
// @route   POST /api/challenges/:id/join
// @access  Private
const joinChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    if (!challenge.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Challenge is no longer active'
      });
    }

    // Check if challenge has started
    if (new Date() < challenge.startDate) {
      return res.status(400).json({
        success: false,
        message: 'Challenge has not started yet'
      });
    }

    // Check if challenge has ended
    if (new Date() > challenge.endDate) {
      return res.status(400).json({
        success: false,
        message: 'Challenge has already ended'
      });
    }

    // Check if user is already a participant
    if (challenge.participants.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already participating in this challenge'
      });
    }

    // Check if challenge is full
    if (challenge.maxParticipants && challenge.participants.length >= challenge.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Challenge is full'
      });
    }

    // Add user to challenge participants
    await Challenge.findByIdAndUpdate(
      req.params.id,
      { $push: { participants: req.user._id } }
    );

    // Add challenge to user's participated challenges
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { participatedChallenges: req.params.id } }
    );

    // Award points for joining
    await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { points: 5 } }
    );

    res.json({
      success: true,
      message: 'Successfully joined the challenge! You earned 5 points.'
    });
  } catch (error) {
    console.error('Join challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error joining challenge'
    });
  }
};

// @desc    Leave challenge
// @route   POST /api/challenges/:id/leave
// @access  Private
const leaveChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    // Check if user is a participant
    if (!challenge.participants.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are not participating in this challenge'
      });
    }

    // Remove user from challenge participants
    await Challenge.findByIdAndUpdate(
      req.params.id,
      { $pull: { participants: req.user._id } }
    );

    // Remove challenge from user's participated challenges
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { participatedChallenges: req.params.id } }
    );

    res.json({
      success: true,
      message: 'Successfully left the challenge'
    });
  } catch (error) {
    console.error('Leave challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error leaving challenge'
    });
  }
};

// @desc    Complete challenge
// @route   POST /api/challenges/:id/complete
// @access  Private
const completeChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    // Check if user is a participant
    if (!challenge.participants.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are not participating in this challenge'
      });
    }

    // Check if challenge has ended
    if (new Date() > challenge.endDate) {
      return res.status(400).json({
        success: false,
        message: 'Challenge has already ended'
      });
    }

    // Award points for completing challenge
    await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { points: challenge.pointsReward } }
    );

    res.json({
      success: true,
      message: `Challenge completed! You earned ${challenge.pointsReward} points.`
    });
  } catch (error) {
    console.error('Complete challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error completing challenge'
    });
  }
};

module.exports = {
  getChallenges,
  getChallenge,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  joinChallenge,
  leaveChallenge,
  completeChallenge
};


