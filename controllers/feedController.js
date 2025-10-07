const Event = require('../models/Event');
const VolunteerOpportunity = require('../models/VolunteerOpportunity');
const Challenge = require('../models/Challenge');

/**
 * @desc    Get community feed with efficient pagination and filtering
 * @route   GET /api/feed
 * @access  Public
 */
// In feedController.js

const getFeed = async (req, res) => {
  try {
    // --- START: MODIFIED LINES ---
    // Check for the literal string 'undefined' coming from the frontend and treat it as actually undefined.
    const type = req.query.type === 'undefined' ? undefined : req.query.type;
    const searchQuery = (req.query.search === 'undefined' || !req.query.search) ? '' : req.query.search;
    // --- END: MODIFIED LINES ---

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const searchMatch = searchQuery
      ? { $or: [{ title: { $regex: searchQuery, $options: 'i' } }, { description: { $regex: searchQuery, $options: 'i' } }] }
      : {};

    const createModelPipeline = (model, matchCondition, itemType) => {
      return model.aggregate([
        { $match: { ...matchCondition, ...searchMatch } },
        {
          $lookup: {
            from: 'users',
            localField: 'organizer',
            foreignField: '_id',
            as: 'organizerInfo',
          },
        },
        {
          $unwind: {
            path: '$organizerInfo',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            date: { $ifNull: ['$date', '$startDate'] },
            location: 1,
            createdAt: 1,
            type: itemType,
            category: { $ifNull: ['$category', null] },
            role: { $ifNull: ['$role', null] },
            organization: { $ifNull: ['$organization', null] },
            difficulty: { $ifNull: ['$difficulty', null] },
            pointsReward: { $ifNull: ['$pointsReward', null] },
            participantCount: { $size: '$participants' },
            maxParticipants: { $ifNull: ['$maxParticipants', null] },
            organizer: {
              _id: '$organizerInfo._id',
              name: '$organizerInfo.name',
            },
          },
        },
      ]);
    };

    const pipelines = [];

    if (!type || type === 'event') {
      pipelines.push(createModelPipeline(Event, { isActive: true, date: { $gte: new Date() } }, 'event'));
    }
    if (!type || type === 'volunteer') {
      pipelines.push(createModelPipeline(VolunteerOpportunity, { isActive: true, date: { $gte: new Date() } }, 'volunteer'));
    }
    if (!type || type === 'challenge') {
      pipelines.push(createModelPipeline(Challenge, { isActive: true, endDate: { $gte: new Date() } }, 'challenge'));
    }
    
    if (pipelines.length === 0) {
      return res.json({
        success: true,
        data: { feed: [], pagination: { current: page, pages: 0, total: 0 } }
      });
    }

    const allResults = await Promise.all(pipelines);
    const combinedFeed = [].concat(...allResults);

    combinedFeed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const totalItems = combinedFeed.length;
    const paginatedItems = combinedFeed.slice(skip, skip + limit);

    res.json({
      success: true,
      data: {
        feed: paginatedItems,
        pagination: {
          current: page,
          pages: Math.ceil(totalItems / limit),
          total: totalItems,
        },
      },
    });

  } catch (error) {
    console.error('--- [FEED] CRITICAL ERROR ---', error);
    res.status(500).json({ success: false, message: 'Server error fetching feed' });
  }
};

/**
 * @desc    Get personalized feed for user (placeholder, can be improved similarly)
 * @route   GET /api/feed/personalized
 * @access  Private
 */
const getPersonalizedFeed = async (req, res) => {
  // This function can also be updated to use the aggregation pipeline for better performance
  // ... (existing code for getPersonalizedFeed)
};

module.exports = {
  getFeed,
  getPersonalizedFeed
};