 Achievement = require('../models/Achievement');
const User = require('../models/User');

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
const getAchievements = async (req, res) => {
  try {
    const { category, rarity, page = 1, limit = 20 } = req.query;
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (rarity) {
      query.rarity = rarity;
    }

    const achievements = await Achievement.find(query)
      .sort({ pointsRequired: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Achievement.countDocuments(query);

    res.json({
      success: true,
      data: {
        achievements,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching achievements'
    });
  }
};

// @desc    Get single achievement
// @route   GET /api/achievements/:id
// @access  Public
const getAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    res.json({
      success: true,
      data: { achievement }
    });
  } catch (error) {
    console.error('Get achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching achievement'
    });
  }
};

// @desc    Get user's achievements
// @route   GET /api/achievements/user/:userId
// @access  Public
const getUserAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('achievements', 'title description badgeIcon category rarity pointsRequired');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { achievements: user.achievements }
    });
  } catch (error) {
    console.error('Get user achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user achievements'
    });
  }
};

// @desc    Get user's current achievements and next unlockable
// @route   GET /api/achievements/my-achievements
// @access  Private
const getMyAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('achievements', 'title description badgeIcon category rarity pointsRequired');

    // Get next achievement to unlock
    const nextAchievement = await Achievement.getNextAchievement(user.points);

    // Get all unlockable achievements
    const unlockableAchievements = await Achievement.getUnlockableAchievements(user.points);

    res.json({
      success: true,
      data: {
        currentAchievements: user.achievements,
        nextAchievement,
        unlockableAchievements,
        totalPoints: user.points
      }
    });
  } catch (error) {
    console.error('Get my achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching achievements'
    });
  }
};

// @desc    Create new achievement (Admin only)
// @route   POST /api/achievements
// @access  Private
const createAchievement = async (req, res) => {
  try {
    const {
      title,
      description,
      pointsRequired,
      badgeIcon,
      category,
      rarity,
      criteria
    } = req.body;

    const achievement = await Achievement.create({
      title,
      description,
      pointsRequired,
      badgeIcon,
      category,
      rarity,
      criteria
    });

    res.status(201).json({
      success: true,
      message: 'Achievement created successfully',
      data: { achievement }
    });
  } catch (error) {
    console.error('Create achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating achievement'
    });
  }
};

// @desc    Update achievement (Admin only)
// @route   PUT /api/achievements/:id
// @access  Private
const updateAchievement = async (req, res) => {
  try {
    const {
      title,
      description,
      pointsRequired,
      badgeIcon,
      category,
      rarity,
      criteria,
      isActive
    } = req.body;

    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (pointsRequired !== undefined) updateData.pointsRequired = pointsRequired;
    if (badgeIcon) updateData.badgeIcon = badgeIcon;
    if (category) updateData.category = category;
    if (rarity) updateData.rarity = rarity;
    if (criteria) updateData.criteria = criteria;
    if (isActive !== undefined) updateData.isActive = isActive;

    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    res.json({
      success: true,
      message: 'Achievement updated successfully',
      data: { achievement }
    });
  } catch (error) {
    console.error('Update achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating achievement'
    });
  }
};

// @desc    Delete achievement (Admin only)
// @route   DELETE /api/achievements/:id
// @access  Private
const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    res.json({
      success: true,
      message: 'Achievement deleted successfully'
    });
  } catch (error) {
    console.error('Delete achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting achievement'
    });
  }
};

// @desc    Award achievement to user (Admin only)
// @route   POST /api/achievements/:id/award/:userId
// @access  Private
const awardAchievement = async (req, res) => {
  try {
    const { userId } = req.params;
    const achievementId = req.params.id;

    const achievement = await Achievement.findById(achievementId);
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user already has this achievement
    if (user.achievements.includes(achievementId)) {
      return res.status(400).json({
        success: false,
        message: 'User already has this achievement'
      });
    }

    // Add achievement to user
    await User.findByIdAndUpdate(
      userId,
      { $push: { achievements: achievementId } }
    );

    res.json({
      success: true,
      message: `Achievement "${achievement.title}" awarded to user successfully`
    });
  } catch (error) {
    console.error('Award achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error awarding achievement'
    });
  }
};

module.exports = {
  getAchievements,
  getAchievement,
  getUserAchievements,
  getMyAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  awardAchievement
};


