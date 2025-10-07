const mongoose = require('mongoose');

const volunteerOpportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Volunteer opportunity title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  role: {
    type: String,
    required: [true, 'Volunteer role is required'],
    trim: true,
    maxlength: [100, 'Role cannot exceed 100 characters']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxParticipants: {
    type: Number,
    default: null
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  organization: {
    type: String,
    required: [true, 'Organization is required'],
    trim: true,
    maxlength: [100, 'Organization name cannot exceed 100 characters']
  },
  skillsRequired: [{
    type: String,
    trim: true
  }],
  timeCommitment: {
    type: String,
    required: [true, 'Time commitment is required'],
    enum: ['1-2 hours', 'Half day', 'Full day', 'Multiple days', 'Ongoing']
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for participant count
volunteerOpportunitySchema.virtual('participantCount').get(function() {
  return this.participants.length;
});

// Ensure virtual fields are serialized
volunteerOpportunitySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('VolunteerOpportunity', volunteerOpportunitySchema);


