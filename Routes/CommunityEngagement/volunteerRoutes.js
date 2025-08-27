// src/routes/volunteerRoutes.js

const express = require('express');
const router = express.Router();
const {
  getVolunteerOpportunities,
  getVolunteerOpportunityById,
  registerForVolunteer,
} = require('../../controllers/CommunityEngagement/volunteerController');
const { protect } = require('../../middleware/authMiddleware');

router.route('/').get(getVolunteerOpportunities);
router.route('/:id').get(getVolunteerOpportunityById);
router.route('/:id/register').post(protect, registerForVolunteer);

module.exports = router;