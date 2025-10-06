import express from 'express';
import newsController from './newsController.js';

const router = express.Router();
router.get('/', newsController.getClimateNews);

export default router;