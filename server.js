const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorMiddleware, notFound } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:8081',           // Expo development server
      'http://localhost:3000',           // React development server
      'exp://localhost:8081',            // Expo protocol (localhost)
      'exp://192.168.1.100:8081',        // Expo on local network (adjust IP as needed)
      'exp://*.*.*.*:*',                 // Expo wildcard (from earlier config)
      'http://*.*.*.*:*',                // Dev wildcard (from earlier config)
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Core Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/volunteer-opportunities', require('./routes/volunteerRoutes'));
app.use('/api/challenges', require('./routes/challengeRoutes'));
app.use('/api/achievements', require('./routes/achievementRoutes'));
app.use('/api/feed', require('./routes/feedRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));

// Added: Air Quality & Carbon Footprint APIs
app.use('/api/air-quality', require('./routes/airQualityRoutes'));
app.use('/api/carbon-footprint', require('./routes/carbonFootprintRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'GreenPulse Backend is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'GreenPulse Backend API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      events: '/api/events',
      volunteerOpportunities: '/api/volunteer-opportunities',
      challenges: '/api/challenges',
      achievements: '/api/achievements',
      feed: '/api/feed',
      recommendations: '/api/recommendations',
      airQuality: '/api/air-quality',
      carbonFootprint: '/api/carbon-footprint',
      health: '/api/health',
    },
    documentation: {
      authentication: 'JWT Bearer token required for protected routes',
      responseFormat: {
        success: 'boolean',
        message: 'string',
        data: 'object (optional)',
        errors: 'array (optional)',
      },
    },
  });
});

// Error handling middleware (keep at end)
app.use(notFound);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🌱 GreenPulse Backend running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});

module.exports = app;
