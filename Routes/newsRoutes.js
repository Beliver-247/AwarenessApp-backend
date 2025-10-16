import express from 'express';
import newsController from '../controllers/newsController.js';

const router = express.Router();

// GET /api/news - Get climate news with advanced summarization
router.get('/', newsController.getClimateNews);

// POST /api/news/summarize - Summarize custom text using NLP
router.post('/summarize', newsController.summarizeText);

// GET /api/news/analyze - Analyze environmental news with NLP
router.get('/analyze', newsController.analyzeEnvironmentalNews);

export default router;