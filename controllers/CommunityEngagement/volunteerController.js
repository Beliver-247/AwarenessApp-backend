// src/controllers/volunteerController.js

const VolunteerOpportunity = require('../../models/CommunityEngagement/VolunteerOpportunity');
const User = require('../../models/CommunityEngagement/User');
const asyncHandler = require('express-async-handler');

// @desc    Get all volunteer opportunities
// @route   GET /api/volunteers
// @access  Public
const getVolunteerOpportunities = asyncHandler(async (req, res) => {
  const opportunities = await VolunteerOpportunity.find({});
  res.json(opportunities);
});

// @desc    Get a single volunteer opportunity by ID
// @route   GET /api/volunteers/:id
// @access  Public
const getVolunteerOpportunityById = asyncHandler(async (req, res) => {
  const opportunity = await VolunteerOpportunity.findById(req.params.id).populate('volunteers', 'name email');

  if (opportunity) {
    res.json(opportunity);
  } else {
    res.status(404);
    throw new Error('Volunteer opportunity not found');
  }
});

// @desc    User registers for a volunteer opportunity
// @route   POST /api/volunteers/:id/register
// @access  Private
const registerForVolunteer = asyncHandler(async (req, res) => {
  const opportunity = await VolunteerOpportunity.findById(req.params.id);
  const user = await User.findById(req.user._id);

  if (opportunity && user) {
    // Check if the user has already registered
    if (opportunity.volunteers.includes(user._id)) {
      res.status(400);
      throw new Error('You have already registered for this opportunity');
    }

    opportunity.volunteers.push(user._id);
    user.volunteeredFor.push(opportunity._id);

    await opportunity.save();
    await user.save();

    res.status(200).json({
      message: 'Successfully registered for the volunteer opportunity',
      opportunity: opportunity,
    });
  } else {
    res.status(404);
    throw new Error('Opportunity or User not found');
  }
});

module.exports = {
  getVolunteerOpportunities,
  getVolunteerOpportunityById,
  registerForVolunteer,
};