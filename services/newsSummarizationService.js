// Advanced News Summarization Service using NLP techniques
// This service provides intelligent text summarization for news articles

class NewsSummarizationService {
  constructor() {
    // Common stop words for filtering
    this.stopWords = new Set([
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
      'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
      'to', 'was', 'will', 'with', 'the', 'this', 'but', 'they', 'have',
      'had', 'what', 'said', 'each', 'which', 'she', 'do', 'how', 'their',
      'if', 'up', 'out', 'many', 'then', 'them', 'these', 'so', 'some',
      'her', 'would', 'make', 'like', 'into', 'him', 'time', 'has', 'two',
      'more', 'very', 'can', 'could', 'way', 'been', 'call', 'who', 'its'
    ]);

    // Climate and environmental keywords for relevance scoring
    this.environmentalKeywords = new Set([
      'climate', 'global warming', 'greenhouse gas', 'carbon', 'emissions',
      'renewable', 'solar', 'wind', 'energy', 'environmental', 'pollution',
      'sustainability', 'green', 'eco', 'biodiversity', 'conservation',
      'temperature', 'fossil fuel', 'deforestation', 'ocean', 'atmosphere',
      'ecosystem', 'sustainable', 'recycling', 'carbon footprint', 'paris agreement'
    ]);
  }

  /**
   * Main summarization function
   * @param {string} text - The text to summarize
   * @param {number} maxSentences - Maximum number of sentences in summary
   * @returns {string} - Summarized text
   */
  async summarizeText(text, maxSentences = 3) {
    if (!text || text.trim().length === 0) {
      return '';
    }

    try {
      // Clean and prepare text
      const cleanedText = this.cleanText(text);
      
      // Split into sentences
      const sentences = this.extractSentences(cleanedText);
      
      if (sentences.length <= maxSentences) {
        return sentences.join(' ');
      }

      // Score sentences based on various factors
      const scoredSentences = this.scoreSentences(sentences, cleanedText);

      // Select top sentences
      const topSentences = this.selectTopSentences(scoredSentences, maxSentences);

      // Return summarized text
      return topSentences.map(item => item.sentence).join(' ');

    } catch (error) {
      console.error('Error in text summarization:', error);
      // Fallback to simple summarization
      return this.simpleSummarize(text, maxSentences);
    }
  }

  /**
   * Clean and normalize text
   * @param {string} text - Raw text
   * @returns {string} - Cleaned text
   */
  cleanText(text) {
    return text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[^\w\s.,!?;:-]/g, '') // Remove special characters except punctuation
      .trim();
  }

  /**
   * Extract sentences from text
   * @param {string} text - Input text
   * @returns {Array} - Array of sentences
   */
  extractSentences(text) {
    // Split by sentence delimiters
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    
    return sentences
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 20) // Filter out very short sentences
      .filter(sentence => !sentence.match(/^[A-Z\s]+$/)) // Filter out all-caps sentences (likely headers)
      .slice(0, 20); // Limit to first 20 sentences to improve performance
  }

  /**
   * Score sentences based on various NLP factors
   * @param {Array} sentences - Array of sentences
   * @param {string} fullText - Full text for context
   * @returns {Array} - Array of scored sentences
   */
  scoreSentences(sentences, fullText) {
    const wordFreq = this.calculateWordFrequency(fullText);
    
    return sentences.map((sentence, index) => {
      let score = 0;

      // 1. Position-based scoring (earlier sentences often more important)
      score += (sentences.length - index) / sentences.length * 0.3;

      // 2. Word frequency scoring
      score += this.calculateSentenceFrequencyScore(sentence, wordFreq) * 0.4;

      // 3. Environmental relevance scoring
      score += this.calculateEnvironmentalRelevance(sentence) * 0.2;

      // 4. Sentence length scoring (prefer moderate length)
      score += this.calculateLengthScore(sentence) * 0.1;

      return {
        sentence: sentence,
        score: score,
        index: index
      };
    });
  }

  /**
   * Calculate word frequency in text
   * @param {string} text - Input text
   * @returns {Object} - Word frequency map
   */
  calculateWordFrequency(text) {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !this.stopWords.has(word));

    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return frequency;
  }

  /**
   * Calculate frequency-based score for a sentence
   * @param {string} sentence - Input sentence
   * @param {Object} wordFreq - Word frequency map
   * @returns {number} - Frequency score
   */
  calculateSentenceFrequencyScore(sentence, wordFreq) {
    const words = sentence.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => !this.stopWords.has(word));

    if (words.length === 0) return 0;

    const totalScore = words.reduce((sum, word) => {
      return sum + (wordFreq[word] || 0);
    }, 0);

    return totalScore / words.length;
  }

  /**
   * Calculate environmental relevance score
   * @param {string} sentence - Input sentence
   * @returns {number} - Environmental relevance score
   */
  calculateEnvironmentalRelevance(sentence) {
    const lowerSentence = sentence.toLowerCase();
    let score = 0;

    this.environmentalKeywords.forEach(keyword => {
      if (lowerSentence.includes(keyword)) {
        score += 1;
      }
    });

    return Math.min(score / 3, 1); // Normalize to 0-1
  }

  /**
   * Calculate length-based score (prefer moderate length sentences)
   * @param {string} sentence - Input sentence
   * @returns {number} - Length score
   */
  calculateLengthScore(sentence) {
    const length = sentence.split(/\s+/).length;
    
    // Prefer sentences between 10-25 words
    if (length >= 10 && length <= 25) {
      return 1;
    } else if (length >= 8 && length <= 30) {
      return 0.7;
    } else if (length >= 5 && length <= 35) {
      return 0.4;
    } else {
      return 0.1;
    }
  }

  /**
   * Select top sentences for summary
   * @param {Array} scoredSentences - Array of scored sentences
   * @param {number} maxSentences - Maximum sentences to select
   * @returns {Array} - Top sentences
   */
  selectTopSentences(scoredSentences, maxSentences) {
    // Sort by score (descending) and then by original position
    const sortedSentences = scoredSentences
      .sort((a, b) => {
        if (Math.abs(a.score - b.score) < 0.1) {
          return a.index - b.index; // Prefer earlier sentences if scores are close
        }
        return b.score - a.score;
      })
      .slice(0, maxSentences);

    // Sort selected sentences by their original order
    return sortedSentences.sort((a, b) => a.index - b.index);
  }

  /**
   * Simple fallback summarization
   * @param {string} text - Input text
   * @param {number} maxSentences - Maximum sentences
   * @returns {string} - Simple summary
   */
  simpleSummarize(text, maxSentences) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    return sentences.slice(0, maxSentences).join(' ').trim();
  }

  /**
   * Summarize news article with metadata
   * @param {Object} article - News article object
   * @returns {Object} - Enhanced article with summary
   */
  async summarizeNewsArticle(article) {
    if (!article) return article;

    try {
      let textToSummarize = '';
      
      // Combine title, description, and content for better summarization
      if (article.title) textToSummarize += article.title + '. ';
      if (article.description) textToSummarize += article.description + '. ';
      if (article.content) textToSummarize += article.content;

      const summary = await this.summarizeText(textToSummarize, 3);
      const shortSummary = await this.summarizeText(textToSummarize, 1);

      return {
        ...article,
        summary: summary,
        shortSummary: shortSummary,
        isEnvironmental: this.calculateEnvironmentalRelevance(textToSummarize) > 0.3,
        summaryMetadata: {
          originalLength: textToSummarize.length,
          summaryLength: summary.length,
          compressionRatio: summary.length / textToSummarize.length
        }
      };
    } catch (error) {
      console.error('Error summarizing news article:', error);
      return {
        ...article,
        summary: this.simpleSummarize(article.content || article.description || '', 3),
        shortSummary: this.simpleSummarize(article.content || article.description || '', 1),
        isEnvironmental: false,
        summaryMetadata: { error: error.message }
      };
    }
  }

  /**
   * Batch summarize multiple articles
   * @param {Array} articles - Array of news articles
   * @returns {Array} - Array of summarized articles
   */
  async summarizeMultipleArticles(articles) {
    if (!Array.isArray(articles)) return [];

    const summarizationPromises = articles.map(article => 
      this.summarizeNewsArticle(article)
    );

    try {
      return await Promise.all(summarizationPromises);
    } catch (error) {
      console.error('Error in batch summarization:', error);
      // Return articles with simple summaries as fallback
      return articles.map(article => ({
        ...article,
        summary: this.simpleSummarize(article.content || article.description || '', 3),
        shortSummary: this.simpleSummarize(article.content || article.description || '', 1)
      }));
    }
  }
}

export default NewsSummarizationService;