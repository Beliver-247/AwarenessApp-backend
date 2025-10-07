const { getEventRecommendations, getChallengeRecommendations } = require('../config/gemini');
const Event = require('../models/Event');
const Challenge = require('../models/Challenge');
const User = require('../models/User');

// @desc    Get AI-powered event recommendations
// @route   GET /api/recommendations/events
// @access  Private
const getEventRecommendationsForUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('participatedEvents', 'title description category');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get available events
    const availableEvents = await Event.find({
      isActive: true,
      date: { $gte: new Date() }
    })
    .populate('participants') // <-- FIX: Added populate to prevent virtual getter error
    .select('title description category location date participants');

    if (availableEvents.length === 0) {
      return res.json({
        success: true,
        message: 'No events available for recommendations',
        data: { recommendations: [] }
      });
    }

    // <-- ADDITION START: Log the request to Gemini
    console.log('--- Sending Event Recommendation Request to Gemini ---');
    console.log('User Description:', user.description);
    console.log('User Participated Events:', JSON.stringify(user.participatedEvents, null, 2));
    + console.log('Available Events (titles):', availableEvents.map(e => e.title));
    console.log('----------------------------------------------------');
    // <-- ADDITION END

    const geminiResponse = await getEventRecommendations(
      user.description,
      user.participatedEvents,
      availableEvents,
      process.env.GEMINI_API_KEY
    );

    // <-- ADDITION START: Log the response from Gemini
    console.log('--- Received Event Recommendation Response from Gemini ---');
    console.log(JSON.stringify(geminiResponse, null, 2));
    console.log('--------------------------------------------------------');
    // <-- ADDITION END

    let recommendations = [];
    
    try {
      let responseText = geminiResponse.candidates[0].content.parts[0].text;
      
      // <-- FIX START: Clean the Gemini response before parsing
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        responseText = jsonMatch[1];
      }
      // <-- FIX END
      
      const recommendedTitles = JSON.parse(responseText);
      
      recommendations = availableEvents.filter(event => 
        recommendedTitles.includes(event.title)
      );
      
      if (recommendations.length === 0) {
        recommendations = availableEvents.slice(0, 3);
      }
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      const userCategories = [...new Set(user.participatedEvents.map(e => e.category))];
      recommendations = availableEvents
        .filter(event => userCategories.includes(event.category))
        .slice(0, 3);
      
      if (recommendations.length === 0) {
        recommendations = availableEvents.slice(0, 3);
      }
    }

    res.json({
      success: true,
      data: {
        recommendations,
        userProfile: {
          description: user.description,
          pastEventsCount: user.participatedEvents.length,
          totalPoints: user.points
        }
      }
    });
  } catch (error) {
    console.error('Get event recommendations error:', error);
    
    try {
      const availableEvents = await Event.find({
        isActive: true,
        date: { $gte: new Date() }
      })
        .populate('organizer', 'name')
        .populate('participants') // <-- FIX: Added populate here as well
        .sort({ date: 1 })
        .limit(3);

      res.json({
        success: true,
        message: 'Using fallback recommendations',
        data: {
          recommendations: availableEvents
        }
      });
    } catch (fallbackError) {
      res.status(500).json({
        success: false,
        message: 'Server error fetching recommendations'
      });
    }
  }
};

// @desc    Get AI-powered challenge recommendations
// @route   GET /api/recommendations/challenges
// @access  Private
const getChallengeRecommendationsForUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('participatedChallenges', 'title description category difficulty');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const availableChallenges = await Challenge.find({
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    })
    .populate('participants') // <-- FIX: Added populate to prevent virtual getter error
    .select('title description category difficulty pointsReward startDate endDate');

    if (availableChallenges.length === 0) {
      return res.json({
        success: true,
        message: 'No challenges available for recommendations',
        data: { recommendations: [] }
      });
    }

    // <-- ADDITION START: Log the request to Gemini
    console.log('--- Sending Challenge Recommendation Request to Gemini ---');
    console.log('User Description:', user.description);
    console.log('User Participated Challenges:', JSON.stringify(user.participatedChallenges, null, 2));
    console.log('Available Challenges:', JSON.stringify(availableChallenges, null, 2));
    console.log('--------------------------------------------------------');
    // <-- ADDITION END

    const geminiResponse = await getChallengeRecommendations(
      user.description,
      user.participatedChallenges,
      availableChallenges,
      process.env.GEMINI_API_KEY
    );

    // <-- ADDITION START: Log the response from Gemini
    console.log('--- Received Challenge Recommendation Response from Gemini ---');
    console.log(JSON.stringify(geminiResponse, null, 2));
    console.log('------------------------------------------------------------');
    // <-- ADDITION END

    let recommendations = [];
    
    try {
      let responseText = geminiResponse.candidates[0].content.parts[0].text;
      
      // <-- FIX START: Clean the Gemini response before parsing
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        responseText = jsonMatch[1];
      }
      // <-- FIX END
      
      const recommendedTitles = JSON.parse(responseText);
      
      recommendations = availableChallenges.filter(challenge => 
        recommendedTitles.includes(challenge.title)
      );
      
      if (recommendations.length === 0) {
        recommendations = availableChallenges
          .sort((a, b) => b.pointsReward - a.pointsReward)
          .slice(0, 3);
      }
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      const userCategories = [...new Set(user.participatedChallenges.map(c => c.category))];
      recommendations = availableChallenges
        .filter(challenge => userCategories.includes(challenge.category))
        .slice(0, 3);
      
      if (recommendations.length === 0) {
        recommendations = availableChallenges.slice(0, 3);
      }
    }

    res.json({
      success: true,
      data: {
        recommendations,
        userProfile: {
          description: user.description,
          pastChallengesCount: user.participatedChallenges.length,
          totalPoints: user.points
        }
      }
    });
  } catch (error) {
    console.error('Get challenge recommendations error:', error);
    
    try {
      const availableChallenges = await Challenge.find({
        isActive: true,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() }
      })
        .populate('organizer', 'name')
        .populate('participants') // <-- FIX: Added populate here as well
        .sort({ pointsReward: -1 })
        .limit(3);

      res.json({
        success: true,
        message: 'Using fallback recommendations',
        data: {
          recommendations: availableChallenges
        }
      });
    } catch (fallbackError) {
      res.status(500).json({
        success: false,
        message: 'Server error fetching recommendations'
      });
    }
  }
};

// @desc    Get general recommendations (events + challenges)
// @route   GET /api/recommendations
// @access  Private
const getGeneralRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('participatedEvents', 'title description category')
      .populate('participatedChallenges', 'title description category difficulty');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const [availableEvents, availableChallenges] = await Promise.all([
      Event.find({
        isActive: true,
        date: { $gte: new Date() }
      })
      .populate('participants') // <-- FIX: Added populate here
      .select('title description category location date').limit(10),
      
      Challenge.find({
        isActive: true,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() }
      })
      .populate('participants') // <-- FIX: And here
      .select('title description category difficulty pointsReward startDate endDate').limit(10)
    ]);

    const userEventCategories = [...new Set(user.participatedEvents.map(e => e.category))];
    const userChallengeCategories = [...new Set(user.participatedChallenges.map(c => c.category))];

    const recommendedEvents = availableEvents
      .filter(event => userEventCategories.includes(event.category))
      .slice(0, 3);

    const recommendedChallenges = availableChallenges
      .filter(challenge => userChallengeCategories.includes(challenge.category))
      .slice(0, 3);

    const finalEvents = recommendedEvents.length > 0 
      ? recommendedEvents 
      : availableEvents.slice(0, 3);

    const finalChallenges = recommendedChallenges.length > 0 
      ? recommendedChallenges 
      : availableChallenges.slice(0, 3);

    res.json({
      success: true,
      data: {
        events: finalEvents,
        challenges: finalChallenges
      }
    });
  } catch (error) {
    console.error('Get general recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching recommendations'
    });
  }
};

module.exports = {
  getEventRecommendationsForUser,
  getChallengeRecommendationsForUser,
  getGeneralRecommendations
};