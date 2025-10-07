const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Challenge title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Challenge description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxParticipants: {
    type: Number,
    default: null
  },
  category: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'seasonal', 'annual'],
    required: [true, 'Challenge category is required']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  pointsReward: {
    type: Number,
    required: [true, 'Points reward is required'],
    min: [1, 'Points reward must be at least 1']
  },
  requirements: [{
    type: String,
    trim: true
  }],
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Virtual for participant count
challengeSchema.virtual('participantCount').get(function () {
  return Array.isArray(this.participants) ? this.participants.length : 0;
});

// Virtual for duration in days
challengeSchema.virtual('duration').get(function() {
  const diffTime = Math.abs(this.endDate - this.startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual to check if challenge is currently active
challengeSchema.virtual('isCurrentlyActive').get(function() {
  const now = new Date();
  return now >= this.startDate && now <= this.endDate && this.isActive;
});

// Ensure virtual fields are serialized
challengeSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Challenge', challengeSchema);


