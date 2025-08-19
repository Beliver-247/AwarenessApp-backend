// src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const {
  registerUser,
  getUserProfile,
  updateUserProfile,
} = require('../../controllers/CommunityEngagement/userController');
const { protect } = require('../../middleware/authMiddleware'); // Assuming you have an authentication middleware

router.post('/register', registerUser);
router.get('/:id', protect, getUserProfile); // Using a placeholder for the user ID
router.put('/:id', protect, updateUserProfile);

module.exports = router;