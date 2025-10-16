import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    type: String,
    required: true,
    trim: true
  }],
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  explanation: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['climate', 'air-quality', 'carbon-footprint', 'renewable-energy', 'general'],
    default: 'general'
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  points: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const UserAnswerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  selectedAnswer: {
    type: Number,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  }
}, {
  timestamps: true
});

const QuizSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  totalScore: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  completedAt: {
    type: Date
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Question = mongoose.model('Question', QuestionSchema);
const UserAnswer = mongoose.model('UserAnswer', UserAnswerSchema);
const QuizSession = mongoose.model('QuizSession', QuizSessionSchema);

export {
  Question,
  UserAnswer,
  QuizSession
};