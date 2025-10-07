const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Achievement title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Achievement description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  pointsRequired: {
    type: Number,
    required: [true, 'Points required is required'],
    min: [0, 'Points required must be at least 0']
  },
  badgeIcon: {
    type: String,
    required: [true, 'Badge icon is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['participation', 'leadership', 'environmental', 'community', 'milestone'],
    required: [true, 'Achievement category is required']
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  criteria: {
    type: String,
    maxlength: [300, 'Criteria cannot exceed 300 characters']
  }
}, {
  timestamps: true
});

// Static method to find achievements user can unlock
achievementSchema.statics.getUnlockableAchievements = function(userPoints) {
  return this.find({
    pointsRequired: { $lte: userPoints },
    isActive: true
  }).sort({ pointsRequired: -1 });
};

// Static method to find next achievement to unlock
achievementSchema.statics.getNextAchievement = function(userPoints) {
  return this.findOne({
    pointsRequired: { $gt: userPoints },
    isActive: true
  }).sort({ pointsRequired: 1 });
};

module.exports = mongoose.model('Achievement', achievementSchema);


