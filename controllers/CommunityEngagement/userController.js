// src/controllers/userController.js

const User = require('../../models/CommunityEngagement/User');
const asyncHandler = require('express-async-handler'); // Helper for handling async errors

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password, // In a real app, you would hash this password
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private (requires authentication)
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password') // Don't return the password
    .populate('joinedEvents')
    .populate('joinedChallenges')
    .populate('volunteeredFor')
    .populate('achievements');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Only update password if it's provided in the request
    if (req.body.password) {
      user.password = req.body.password; // In a real app, hash the new password
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      points: updatedUser.points,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  registerUser,
  getUserProfile,
  updateUserProfile,
};