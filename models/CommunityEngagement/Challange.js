// src/models/Challenge.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const challengeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  points: {
    type: Number,
    default: 20, // Points awarded for completing the challenge
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  // For group-based challenges
  groupBased: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Challenge', challengeSchema);