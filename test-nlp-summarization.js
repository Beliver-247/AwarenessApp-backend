// Test script for NLP News Summarization Service
import NewsSummarizationService from './services/newsSummarizationService.js';

const summarizationService = new NewsSummarizationService();

// Sample climate news article for testing
const sampleArticle = {
  title: "Global Climate Summit Reaches Historic Agreement on Carbon Emissions",
  description: "World leaders agree on ambitious targets to reduce greenhouse gas emissions by 50% within the next decade.",
  content: `The 2025 Global Climate Summit concluded today with a groundbreaking agreement that commits 195 countries to unprecedented action on climate change. The historic accord, dubbed the "Paris Plus Agreement," sets legally binding targets for reducing greenhouse gas emissions by 50% before 2035. 

The agreement comes as scientific reports continue to warn about the accelerating pace of global warming. Temperature records have been broken repeatedly this year, with average global temperatures rising 1.8 degrees Celsius above pre-industrial levels. Scientists warn that without immediate action, the world faces catastrophic climate consequences including rising sea levels, extreme weather events, and widespread ecosystem collapse.

Under the new agreement, developed nations commit to achieving carbon neutrality by 2030, while developing countries have until 2035 to reach the same goal. The accord also establishes a $500 billion climate fund to help developing nations transition to renewable energy sources and adapt to climate impacts.

Key provisions include mandatory targets for renewable energy adoption, with countries required to generate at least 80% of their electricity from solar, wind, and other clean sources by 2030. The agreement also bans new coal-fired power plants and requires existing facilities to be phased out within 15 years.

Environmental groups have cautiously welcomed the agreement, though many argue the targets don't go far enough. "This is a significant step forward, but we need even more ambitious action to avoid climate catastrophe," said Maria Rodriguez, director of the Global Climate Alliance. The fossil fuel industry has criticized the agreement as "economically unrealistic," warning of potential job losses and energy security concerns.

Implementation will begin immediately, with countries required to submit detailed transition plans within six months. The agreement includes strict monitoring and enforcement mechanisms, with potential trade sanctions for nations that fail to meet their commitments.`
};

async function testNLPSummarization() {
  console.log('🧪 Testing NLP News Summarization Service');
  console.log('================================================\n');

  // Test 1: Basic text summarization
  console.log('📝 Test 1: Basic Text Summarization');
  console.log('-----------------------------------');
  const summary = await summarizationService.summarizeText(sampleArticle.content, 3);
  console.log('Original length:', sampleArticle.content.length, 'characters');
  console.log('Summary length:', summary.length, 'characters');
  console.log('Compression ratio:', (summary.length / sampleArticle.content.length).toFixed(2));
  console.log('\nSummary:');
  console.log(summary);
  console.log('\n');

  // Test 2: Article summarization with metadata
  console.log('📰 Test 2: Article Summarization with Metadata');
  console.log('---------------------------------------------');
  const enhancedArticle = await summarizationService.summarizeNewsArticle(sampleArticle);
  console.log('Title:', enhancedArticle.title);
  console.log('Is Environmental:', enhancedArticle.isEnvironmental);
  console.log('Compression Ratio:', enhancedArticle.summaryMetadata.compressionRatio.toFixed(2));
  console.log('\nFull Summary:');
  console.log(enhancedArticle.summary);
  console.log('\nShort Summary:');
  console.log(enhancedArticle.shortSummary);
  console.log('\n');

  // Test 3: Multiple articles summarization
  console.log('📚 Test 3: Multiple Articles Summarization');
  console.log('------------------------------------------');
  const multipleArticles = [
    sampleArticle,
    {
      title: "Renewable Energy Costs Hit Record Low",
      description: "Solar and wind power now cheaper than fossil fuels in most markets worldwide.",
      content: "The cost of renewable energy technologies has fallen dramatically over the past decade, with solar photovoltaic costs dropping by 90% since 2010. Wind energy costs have also decreased significantly, making renewable energy the cheapest source of power in many regions. This trend is accelerating the global transition away from fossil fuels, with renewable energy accounting for 80% of all new electricity capacity added worldwide last year."
    },
    {
      title: "Tech Innovation in Climate Solutions",
      description: "New technologies promise breakthrough in carbon capture and storage.",
      content: "Breakthrough technologies in carbon capture and storage are showing promise for removing greenhouse gases from the atmosphere. Companies are developing new materials and processes that can capture CO2 directly from the air and convert it into useful products. These innovations could play a crucial role in achieving net-zero emissions goals."
    }
  ];

  const summarizedArticles = await summarizationService.summarizeMultipleArticles(multipleArticles);
  summarizedArticles.forEach((article, index) => {
    console.log(`Article ${index + 1}:`);
    console.log(`- Title: ${article.title}`);
    console.log(`- Environmental: ${article.isEnvironmental}`);
    console.log(`- Summary: ${article.shortSummary}`);
    console.log('');
  });

  // Test 4: Environmental relevance detection
  console.log('🌍 Test 4: Environmental Relevance Detection');
  console.log('--------------------------------------------');
  const nonEnvironmentalText = "The stock market reached new highs today as technology companies reported strong quarterly earnings. Investors are optimistic about future growth prospects in the artificial intelligence sector.";
  const environmentalText = "Rising sea levels threaten coastal communities as global warming accelerates. Scientists warn that greenhouse gas emissions must be reduced immediately to prevent catastrophic climate change.";

  const nonEnvSummary = await summarizationService.summarizeNewsArticle({
    title: "Stock Market News",
    content: nonEnvironmentalText
  });

  const envSummary = await summarizationService.summarizeNewsArticle({
    title: "Climate Warning",
    content: environmentalText
  });

  console.log('Non-environmental article - Environmental score:', nonEnvSummary.isEnvironmental);
  console.log('Environmental article - Environmental score:', envSummary.isEnvironmental);
  console.log('\n');

  console.log('✅ All tests completed successfully!');
  console.log('\n🎯 NLP Summarization Features Demonstrated:');
  console.log('- Advanced text summarization using frequency analysis');
  console.log('- Environmental relevance detection');
  console.log('- Sentence scoring based on position, relevance, and length');
  console.log('- Batch processing of multiple articles');
  console.log('- Comprehensive metadata generation');
  console.log('- Fallback mechanisms for error handling');
}

// Run the test
testNLPSummarization().catch(error => {
  console.error('❌ Test failed:', error);
});