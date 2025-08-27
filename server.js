// src/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/dbConfig');
const userRoutes = require('./Routes/CommunityEngagement/userRoutes');
const eventRoutes = require('./Routes/CommunityEngagement/eventRoutes');  
const challangeRoutes = require('./Routes/CommunityEngagement/challengeRoutes');  
const volunteerRoutes = require('./Routes/CommunityEngagement/volunteerRoutes');  
const achievementRoutes = require('./Routes/CommunityEngagement/achievementRoutes');  
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Allows the app to accept JSON data in the body
app.use(cors()); // Enables Cross-Origin Resource Sharing

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/challenges', challangeRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/achievements', achievementRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling middleware (should be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});