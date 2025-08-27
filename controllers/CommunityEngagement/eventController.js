// src/controllers/eventController.js

const Event = require('../../models/CommunityEngagement/Event');
const User = require('../../models/CommunityEngagement/User');
const asyncHandler = require('express-async-handler');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({});
  res.json(events);
});

// @desc    Get a single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate('participants', 'name email');

  if (event) {
    res.json(event);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

// @desc    User joins an event
// @route   POST /api/events/:id/join
// @access  Private
const joinEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  const user = await User.findById(req.user._id);

  if (event && user) {
    // Check if the user has already joined
    if (event.participants.includes(user._id)) {
      res.status(400);
      throw new Error('You have already joined this event');
    }

    event.participants.push(user._id);
    user.joinedEvents.push(event._id);

    await event.save();
    await user.save();

    res.status(200).json({
      message: 'Successfully registered for the event',
      event: event,
    });
  } else {
    res.status(404);
    throw new Error('Event or User not found');
  }
});

module.exports = {
  getEvents,
  getEventById,
  joinEvent,
};