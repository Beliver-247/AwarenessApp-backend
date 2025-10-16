import axios from 'axios';
import NewsSummarizationService from '../services/newsSummarizationService.js';

const NEWS_API_URL = process.env.NEWS_API_URL;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Initialize the NLP summarization service
const summarizationService = new NewsSummarizationService();

const getClimateNews = async (req, res) => {
  try {
    const { from, to, sortBy = 'popularity' } = req.query;
    
    console.log('🔍 Fetching climate news...');
    
    // Always use 'climate' as the query
    const response = await axios.get(NEWS_API_URL, {
      params: { q: 'climate', from, to, sortBy, apiKey: NEWS_API_KEY },
    });
    
    const articles = response.data.articles || [];
    console.log(`📰 Found ${articles.length} articles`);
    
    // Use advanced NLP summarization
    console.log('🧠 Using advanced NLP summarization...');
    const summarizedArticles = await summarizationService.summarizeMultipleArticles(articles);
    
    // Add metadata about summarization
    const responseData = {
      articles: summarizedArticles,
      metadata: {
        totalArticles: articles.length,
        summarizationMethod: 'advanced-nlp',
        environmentalArticles: summarizedArticles.filter(a => a.isEnvironmental).length,
        timestamp: new Date().toISOString()
      }
    };
    
    console.log('✅ News summarization completed');
    res.json(responseData);
    
  } catch (err) {
    console.error('❌ Error in getClimateNews:', err);
    res.status(500).json({ 
      error: 'Failed to fetch news', 
      details: err.message,
      timestamp: new Date().toISOString()
    });
  }
};

// New endpoint for custom text summarization
const summarizeText = async (req, res) => {
  try {
    const { text, maxSentences = 3 } = req.body;
    
    if (!text) {
      return res.status(400).json({
        error: 'Text is required',
        message: 'Please provide text to summarize'
      });
    }
    
    console.log('🔍 Summarizing custom text...');
    
    const summary = await summarizationService.summarizeText(text, parseInt(maxSentences));
    
    const responseData = {
      originalText: text,
      summary: summary,
      metadata: {
        originalLength: text.length,
        summaryLength: summary.length,
        compressionRatio: summary.length / text.length,
        maxSentences: parseInt(maxSentences),
        timestamp: new Date().toISOString()
      }
    };
    
    console.log('✅ Text summarization completed');
    res.json(responseData);
    
  } catch (err) {
    console.error('❌ Error in summarizeText:', err);
    res.status(500).json({
      error: 'Failed to summarize text',
      details: err.message,
      timestamp: new Date().toISOString()
    });
  }
};

// New endpoint for environmental news analysis
const analyzeEnvironmentalNews = async (req, res) => {
  try {
    const { query = 'environment sustainability climate', maxArticles = 10 } = req.query;
    
    console.log('🌍 Analyzing environmental news...');
    
    const response = await axios.get(NEWS_API_URL, {
      params: { q: query, pageSize: maxArticles, apiKey: NEWS_API_KEY },
    });
    
    const articles = response.data.articles || [];
    console.log(`📰 Found ${articles.length} articles for analysis`);
    
    // Analyze articles with advanced NLP
    const analyzedArticles = await summarizationService.summarizeMultipleArticles(articles);
    
    // Filter and categorize environmental articles
    const environmentalArticles = analyzedArticles.filter(article => article.isEnvironmental);
    const nonEnvironmentalArticles = analyzedArticles.filter(article => !article.isEnvironmental);
    
    const analysis = {
      totalArticles: articles.length,
      environmentalArticles: environmentalArticles.length,
      environmentalPercentage: (environmentalArticles.length / articles.length) * 100,
      topEnvironmentalArticles: environmentalArticles.slice(0, 5),
      avgCompressionRatio: analyzedArticles.reduce((acc, article) => 
        acc + (article.summaryMetadata?.compressionRatio || 0), 0) / analyzedArticles.length,
      categories: {
        environmental: environmentalArticles.length,
        general: nonEnvironmentalArticles.length
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Environmental news analysis completed');
    res.json({
      articles: analyzedArticles,
      analysis: analysis
    });
    
  } catch (err) {
    console.error('❌ Error in analyzeEnvironmentalNews:', err);
    res.status(500).json({
      error: 'Failed to analyze environmental news',
      details: err.message,
      timestamp: new Date().toISOString()
    });
  }
};

export default { 
  getClimateNews, 
  summarizeText, 
  analyzeEnvironmentalNews 
};