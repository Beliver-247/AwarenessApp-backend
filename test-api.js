import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api/quiz';

async function testQuizAPI() {
  try {
    console.log('🧪 Testing Quiz API endpoints...\n');

    // Test 1: Get questions
    console.log('1. Testing GET /questions');
    const questionsResponse = await fetch(`${API_BASE}/questions?limit=3`);
    const questionsData = await questionsResponse.json();
    console.log('✅ Questions:', questionsData);
    console.log('');

    // Test 2: Get categories
    console.log('2. Testing GET /categories');
    const categoriesResponse = await fetch(`${API_BASE}/categories`);
    const categoriesData = await categoriesResponse.json();
    console.log('✅ Categories:', categoriesData);
    console.log('');

    // Test 3: Start quiz session
    console.log('3. Testing POST /start');
    const startResponse = await fetch(`${API_BASE}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'test-user-123',
        category: 'climate',
        difficulty: 'medium',
        questionCount: 5
      })
    });
    const startData = await startResponse.json();
    console.log('✅ Start Session:', startData);
    console.log('');

    if (questionsData.success && questionsData.data.length > 0) {
      const firstQuestion = questionsData.data[0];
      
      // Test 4: Submit answer
      console.log('4. Testing POST /answer');
      const answerResponse = await fetch(`${API_BASE}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'test-user-123',
          questionId: firstQuestion._id,
          selectedAnswer: 1,
          timeSpent: 5000
        })
      });
      const answerData = await answerResponse.json();
      console.log('✅ Submit Answer:', answerData);
      console.log('');
    }

    console.log('🎉 All API tests completed successfully!');

  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

testQuizAPI();