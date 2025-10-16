import express from 'express';
import { Question, UserAnswer, QuizSession } from '../models/Quiz.js';

const router = express.Router();

// GET /api/quiz/questions - Get all active questions or by category
router.get('/questions', async (req, res) => {
  try {
    const { category, difficulty, limit = 5 } = req.query;
    
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    
    // Use aggregation to randomize questions
    const questions = await Question.aggregate([
      { $match: filter },
      { $sample: { size: parseInt(limit) } },
      { $project: { correctAnswer: 0 } } // Don't send correct answer to frontend
    ]);
    
    res.json({
      success: true,
      data: questions,
      count: questions.length
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching questions',
      error: error.message
    });
  }
});

// GET /api/quiz/questions/:id - Get specific question
router.get('/questions/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .select('-correctAnswer');
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    
    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching question',
      error: error.message
    });
  }
});

// POST /api/quiz/questions - Create new question (Admin only)
router.post('/questions', async (req, res) => {
  try {
    const {
      questionText,
      options,
      correctAnswer,
      explanation,
      category,
      difficulty,
      points
    } = req.body;
    
    // Validation
    if (!questionText || !options || options.length !== 4 || correctAnswer === undefined || !explanation) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields. Question text, 4 options, correct answer, and explanation are required.'
      });
    }
    
    if (correctAnswer < 0 || correctAnswer > 3) {
      return res.status(400).json({
        success: false,
        message: 'Correct answer must be between 0 and 3'
      });
    }
    
    const question = new Question({
      questionText,
      options,
      correctAnswer,
      explanation,
      category: category || 'general',
      difficulty: difficulty || 'medium',
      points: points || 1
    });
    
    await question.save();
    
    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: question
    });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating question',
      error: error.message
    });
  }
});

// POST /api/quiz/start - Start new quiz session
router.post('/start', async (req, res) => {
  try {
    const { userId, category, difficulty, questionCount = 5 } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    
    // Use aggregation to get random questions
    const questions = await Question.aggregate([
      { $match: filter },
      { $sample: { size: parseInt(questionCount) } },
      { $project: { _id: 1 } }
    ]);
    
    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No questions found for the specified criteria'
      });
    }
    
    const session = new QuizSession({
      userId,
      questions: questions.map(q => q._id),
      totalQuestions: questions.length
    });
    
    await session.save();
    
    res.status(201).json({
      success: true,
      message: 'Quiz session started',
      data: {
        sessionId: session._id,
        totalQuestions: session.totalQuestions
      }
    });
  } catch (error) {
    console.error('Error starting quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting quiz',
      error: error.message
    });
  }
});

// POST /api/quiz/answer - Submit answer for a question
router.post('/answer', async (req, res) => {
  try {
    const { userId, questionId, selectedAnswer, timeSpent } = req.body;
    
    if (!userId || !questionId || selectedAnswer === undefined) {
      return res.status(400).json({
        success: false,
        message: 'User ID, question ID, and selected answer are required'
      });
    }
    
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    
    const isCorrect = selectedAnswer === question.correctAnswer;
    
    const userAnswer = new UserAnswer({
      userId,
      questionId,
      selectedAnswer,
      isCorrect,
      timeSpent: timeSpent || 0
    });
    
    await userAnswer.save();
    
    res.json({
      success: true,
      data: {
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        points: isCorrect ? question.points : 0
      }
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting answer',
      error: error.message
    });
  }
});

// POST /api/quiz/complete - Complete quiz session
router.post('/complete', async (req, res) => {
  try {
    const { sessionId, userId } = req.body;
    
    if (!sessionId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and User ID are required'
      });
    }
    
    const session = await QuizSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Quiz session not found'
      });
    }
    
    // Calculate results
    const userAnswers = await UserAnswer.find({
      userId,
      questionId: { $in: session.questions }
    }).populate('questionId');
    
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
    const totalScore = userAnswers.reduce((sum, answer) => {
      return sum + (answer.isCorrect ? answer.questionId.points : 0);
    }, 0);
    const totalTimeSpent = userAnswers.reduce((sum, answer) => sum + answer.timeSpent, 0);
    
    // Update session
    session.correctAnswers = correctAnswers;
    session.totalScore = totalScore;
    session.timeSpent = totalTimeSpent;
    session.completedAt = new Date();
    session.isCompleted = true;
    
    await session.save();
    
    res.json({
      success: true,
      data: {
        sessionId: session._id,
        totalQuestions: session.totalQuestions,
        correctAnswers,
        totalScore,
        accuracy: Math.round((correctAnswers / session.totalQuestions) * 100),
        timeSpent: totalTimeSpent
      }
    });
  } catch (error) {
    console.error('Error completing quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing quiz',
      error: error.message
    });
  }
});

// GET /api/quiz/results/:userId - Get user's quiz history
router.get('/results/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10 } = req.query;
    
    const sessions = await QuizSession.find({ 
      userId, 
      isCompleted: true 
    })
    .sort({ completedAt: -1 })
    .limit(parseInt(limit))
    .select('-questions');
    
    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching results',
      error: error.message
    });
  }
});

// GET /api/quiz/categories - Get available categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Question.distinct('category', { isActive: true });
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

export default router;