import axios from 'axios';

const NEWS_API_URL = process.env.NEWS_API_URL;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

async function summarizeContent(text) {
  if (!text) return '';
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  return sentences.slice(0, 2).join(' ');
}

const getClimateNews = async (req, res) => {
  try {
    const { from, to, sortBy = 'popularity' } = req.query;
    // Always use 'climate' as the query
    const response = await axios.get(NEWS_API_URL, {
      params: { q: 'climate', from, to, sortBy, apiKey: NEWS_API_KEY },
    });
    const articles = response.data.articles || [];
    const summarized = await Promise.all(
      articles.map(async (article) => ({
        ...article,
        summary: await summarizeContent(article.content),
      }))
    );
    res.json({ articles: summarized });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch news', details: err.message });
  }
};

export default { getClimateNews };