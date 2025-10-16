# News API with Advanced NLP Summarization

This API provides advanced text summarization capabilities using Natural Language Processing (NLP) techniques for news articles and custom text.

## Features

- **Advanced NLP Summarization**: Uses frequency analysis, environmental relevance scoring, and sentence positioning
- **Environmental Content Detection**: Automatically identifies climate and environmental news
- **Batch Processing**: Summarize multiple articles efficiently
- **Flexible Summarization**: Control summary length and style
- **Comprehensive Metadata**: Detailed analytics about the summarization process

## Endpoints

### 1. Get Climate News with Advanced Summarization

```
GET /api/news?useAdvancedSummary=true&maxArticles=10
```

**Query Parameters:**
- `useAdvancedSummary` (boolean, default: true) - Use advanced NLP summarization
- `from` (date) - Start date for news articles
- `to` (date) - End date for news articles
- `sortBy` (string) - Sort order (popularity, publishedAt, relevancy)

**Response:**
```json
{
  "articles": [
    {
      "title": "Article title",
      "description": "Article description",
      "content": "Full article content",
      "summary": "Intelligent 3-sentence summary",
      "shortSummary": "Single sentence summary",
      "isEnvironmental": true,
      "summaryMetadata": {
        "originalLength": 1500,
        "summaryLength": 300,
        "compressionRatio": 0.2
      }
    }
  ],
  "metadata": {
    "totalArticles": 20,
    "summarizationMethod": "advanced-nlp",
    "environmentalArticles": 15,
    "timestamp": "2025-10-16T10:30:00Z"
  }
}
```

### 2. Summarize Custom Text

```
POST /api/news/summarize
```

**Request Body:**
```json
{
  "text": "Your long text content here...",
  "maxSentences": 3
}
```

**Response:**
```json
{
  "originalText": "Original text...",
  "summary": "Summarized text...",
  "metadata": {
    "originalLength": 1000,
    "summaryLength": 200,
    "compressionRatio": 0.2,
    "maxSentences": 3,
    "timestamp": "2025-10-16T10:30:00Z"
  }
}
```

### 3. Analyze Environmental News

```
GET /api/news/analyze?query=climate&maxArticles=20
```

**Query Parameters:**
- `query` (string, default: "environment sustainability climate") - Search terms
- `maxArticles` (number, default: 10) - Maximum articles to analyze

**Response:**
```json
{
  "articles": [...], // Array of analyzed articles
  "analysis": {
    "totalArticles": 20,
    "environmentalArticles": 15,
    "environmentalPercentage": 75,
    "topEnvironmentalArticles": [...], // Top 5 environmental articles
    "avgCompressionRatio": 0.25,
    "categories": {
      "environmental": 15,
      "general": 5
    },
    "timestamp": "2025-10-16T10:30:00Z"
  }
}
```

## NLP Summarization Algorithm

The advanced summarization uses multiple scoring factors:

### 1. Position-Based Scoring (30% weight)
- Earlier sentences get higher scores
- Accounts for the "inverted pyramid" structure of news articles

### 2. Word Frequency Scoring (40% weight)
- Analyzes word frequency across the entire text
- Filters out stop words and short words
- Sentences with high-frequency words score higher

### 3. Environmental Relevance Scoring (20% weight)
- Uses predefined environmental keywords
- Climate-related content gets priority
- Keywords include: climate, carbon, emissions, renewable, sustainability, etc.

### 4. Length Scoring (10% weight)
- Prefers sentences of moderate length (10-25 words)
- Filters out very short or very long sentences

### Environmental Keywords Detection

The system recognizes these environmental topics:
- Climate change and global warming
- Greenhouse gases and carbon emissions
- Renewable energy (solar, wind, hydro)
- Environmental conservation
- Sustainability and green technology
- Air quality and pollution
- Biodiversity and ecosystems

## Usage Examples

### Basic Climate News Fetch
```bash
curl "http://localhost:5000/api/news?useAdvancedSummary=true"
```

### Custom Text Summarization
```bash
curl -X POST http://localhost:5000/api/news/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Long article text here...",
    "maxSentences": 2
  }'
```

### Environmental News Analysis
```bash
curl "http://localhost:5000/api/news/analyze?query=renewable%20energy&maxArticles=15"
```

## Error Handling

The API includes comprehensive error handling:
- Fallback to simple summarization if NLP processing fails
- Graceful degradation for network errors
- Detailed error messages with timestamps

## Performance

- **Batch Processing**: Efficiently handles multiple articles
- **Caching**: Consider implementing caching for frequently requested summaries
- **Rate Limiting**: Recommended for production use

## Future Enhancements

- Machine learning model integration
- Sentiment analysis
- Topic modeling
- Multiple language support
- Real-time summarization

---

*This API provides state-of-the-art text summarization specifically optimized for environmental and climate news content.*