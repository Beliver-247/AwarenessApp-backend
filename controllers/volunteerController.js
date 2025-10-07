const { validationResult } = require('express-validator');
const VolunteerOpportunity = require('../models/VolunteerOpportunity');
const User = require('../models/User');

// @desc    Get all volunteer opportunities
// @route   GET /api/volunteer-opportunities
// @access  Public
const getVolunteerOpportunities = async (req, res) => {
  try {
    const { timeCommitment, page = 1, limit = 10, upcoming = true } = req.query;
    
    let query = { isActive: true };
    
    if (timeCommitment) {
      query.timeCommitment = timeCommitment;
    }
    
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    }

    const opportunities = await VolunteerOpportunity.find(query)
      .populate('organizer', 'name')
      .populate('participants', 'name')
      .sort({ date: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await VolunteerOpportunity.countDocuments(query);

    res.json({
      success: true,
      data: {
        opportunities,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get volunteer opportunities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching volunteer opportunities'
    });
  }
};

// @desc    Get single volunteer opportunity
// @route   GET /api/volunteer-opportunities/:id
// @access  Public
const getVolunteerOpportunity = async (req, res) => {
  try {
    const opportunity = await VolunteerOpportunity.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('participants', 'name');

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer opportunity not found'
      });
    }

    res.json({
      success: true,
      data: { opportunity }
    });
  } catch (error) {
    console.error('Get volunteer opportunity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching volunteer opportunity'
    });
  }
};

// @desc    Create new volunteer opportunity
// @route   POST /api/volunteer-opportunities
// @access  Private
const createVolunteerOpportunity = async (req, res) => {
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
      role,
      date,
      location,
      organization,
      skillsRequired,
      timeCommitment,
      maxParticipants
    } = req.body;

    const opportunity = await VolunteerOpportunity.create({
      title,
      description,
      role,
      date,
      location,
      organization,
      skillsRequired: skillsRequired || [],
      timeCommitment,
      maxParticipants,
      organizer: req.user._id
    });

    const populatedOpportunity = await VolunteerOpportunity.findById(opportunity._id)
      .populate('organizer', 'name');

    res.status(201).json({
      success: true,
      message: 'Volunteer opportunity created successfully',
      data: { opportunity: populatedOpportunity }
    });
  } catch (error) {
    console.error('Create volunteer opportunity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating volunteer opportunity'
    });
  }
};

// @desc    Update volunteer opportunity
// @route   PUT /api/volunteer-opportunities/:id
// @access  Private
const updateVolunteerOpportunity = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    let opportunity = await VolunteerOpportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer opportunity not found'
      });
    }

    // Check if user is the organizer
    if (opportunity.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this volunteer opportunity'
      });
    }

    const {
      title,
      description,
      role,
      date,
      location,
      organization,
      skillsRequired,
      timeCommitment,
      maxParticipants
    } = req.body;

    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (role) updateData.role = role;
    if (date) updateData.date = date;
    if (location) updateData.location = location;
    if (organization) updateData.organization = organization;
    if (skillsRequired) updateData.skillsRequired = skillsRequired;
    if (timeCommitment) updateData.timeCommitment = timeCommitment;
    if (maxParticipants !== undefined) updateData.maxParticipants = maxParticipants;

    opportunity = await VolunteerOpportunity.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('organizer', 'name');

    res.json({
      success: true,
      message: 'Volunteer opportunity updated successfully',
      data: { opportunity }
    });
  } catch (error) {
    console.error('Update volunteer opportunity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating volunteer opportunity'
    });
  }
};

// @desc    Delete volunteer opportunity
// @route   DELETE /api/volunteer-opportunities/:id
// @access  Private
const deleteVolunteerOpportunity = async (req, res) => {
  try {
    const opportunity = await VolunteerOpportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer opportunity not found'
      });
    }

    // Check if user is the organizer
    if (opportunity.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this volunteer opportunity'
      });
    }

    await VolunteerOpportunity.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({
      success: true,
      message: 'Volunteer opportunity deleted successfully'
    });
  } catch (error) {
    console.error('Delete volunteer opportunity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting volunteer opportunity'
    });
  }
};

// @desc    Join volunteer opportunity
// @route   POST /api/volunteer-opportunities/:id/join
// @access  Private
const joinVolunteerOpportunity = async (req, res) => {
  try {
    const opportunity = await VolunteerOpportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer opportunity not found'
      });
    }

    if (!opportunity.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Volunteer opportunity is no longer active'
      });
    }

    // Check if user is already a participant
    if (opportunity.participants.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already participating in this volunteer opportunity'
      });
    }

    // Check if opportunity is full
    if (opportunity.maxParticipants && opportunity.participants.length >= opportunity.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Volunteer opportunity is full'
      });
    }

    // Add user to opportunity participants
    await VolunteerOpportunity.findByIdAndUpdate(
      req.params.id,
      { $push: { participants: req.user._id } }
    );

    // Add opportunity to user's volunteer opportunities
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { volunteerOpportunities: req.params.id } }
    );

    // Award points for joining
    await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { points: 15 } }
    );

    res.json({
      success: true,
      message: 'Successfully joined the volunteer opportunity! You earned 15 points.'
    });
  } catch (error) {
    console.error('Join volunteer opportunity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error joining volunteer opportunity'
    });
  }
};

// @desc    Leave volunteer opportunity
// @route   POST /api/volunteer-opportunities/:id/leave
// @access  Private
const leaveVolunteerOpportunity = async (req, res) => {
  try {
    const opportunity = await VolunteerOpportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer opportunity not found'
      });
    }

    // Check if user is a participant
    if (!opportunity.participants.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are not participating in this volunteer opportunity'
      });
    }

    // Remove user from opportunity participants
    await VolunteerOpportunity.findByIdAndUpdate(
      req.params.id,
      { $pull: { participants: req.user._id } }
    );

    // Remove opportunity from user's volunteer opportunities
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { volunteerOpportunities: req.params.id } }
    );

    res.json({
      success: true,
      message: 'Successfully left the volunteer opportunity'
    });
  } catch (error) {
    console.error('Leave volunteer opportunity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error leaving volunteer opportunity'
    });
  }
};

module.exports = {
  getVolunteerOpportunities,
  getVolunteerOpportunity,
  createVolunteerOpportunity,
  updateVolunteerOpportunity,
  deleteVolunteerOpportunity,
  joinVolunteerOpportunity,
  leaveVolunteerOpportunity
};


