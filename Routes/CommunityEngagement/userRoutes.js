// src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
} = require('../../controllers/CommunityEngagement/userController');
const { protect } = require('../../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/:id', protect, getUserProfile);
router.put('/:id', protect, updateUserProfile);

module.exports = router;