// src/models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  joinedEvents: [{
    type: Schema.Types.ObjectId,
    ref: 'Event',
  }],
  joinedChallenges: [{
    type: Schema.Types.ObjectId,
    ref: 'Challenge',
  }],
  volunteeredFor: [{
    type: Schema.Types.ObjectId,
    ref: 'VolunteerOpportunity',
  }],
  achievements: [{
    type: Schema.Types.ObjectId,
    ref: 'Achievement',
  }],
  group: {
    type: String,
    required: false, // Optional for group challenges
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);