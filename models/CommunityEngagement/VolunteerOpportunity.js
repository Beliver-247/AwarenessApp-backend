// src/models/VolunteerOpportunity.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const volunteerOpportunitySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  organization: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  duration: {
    type: String, // e.g., "3 hours", "Ongoing"
  },
  points: {
    type: Number,
    default: 15, // Points awarded for volunteering
  },
  volunteers: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('VolunteerOpportunity', volunteerOpportunitySchema);