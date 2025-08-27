// src/routes/challengeRoutes.js

const express = require('express');
const router = express.Router();
const {
  getChallenges,
  getChallengeById,
  joinChallenge,
} = require('../../controllers/CommunityEngagement/challangeController');
const { protect } = require('../../middleware/authMiddleware');

router.route('/').get(getChallenges);
router.route('/:id').get(getChallengeById);
router.route('/:id/join').post(protect, joinChallenge);

module.exports = router;