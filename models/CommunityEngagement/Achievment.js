// src/models/Achievement.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const achievementSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  pointsRequired: { // e.g., "100 points"
    type: Number,
  },
  type: { // e.g., "Event_Master", "Cleanup_Champion"
    type: String,
  },
  badgeImageUrl: {
    type: String,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Achievement', achievementSchema);