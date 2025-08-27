// src/routes/eventRoutes.js

const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  joinEvent,
} = require('../../controllers/CommunityEngagement/eventController');
const { protect } = require('../../middleware/authMiddleware');

router.route('/').get(getEvents);
router.route('/:id').get(getEventById);
router.route('/:id/join').post(protect, joinEvent);

module.exports = router;