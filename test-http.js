// Test script to verify quiz API endpoints
import http from 'http';

const testEndpoint = (path, method = 'GET', data = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api/quiz${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

async function runTests() {
  console.log('🧪 Testing Quiz API...\n');

  try {
    // Test categories endpoint
    console.log('1. Testing /categories');
    const categories = await testEndpoint('/categories');
    console.log(`Status: ${categories.status}`);
    console.log('Response:', categories.data);
    console.log('');

    // Test questions endpoint
    console.log('2. Testing /questions');
    const questions = await testEndpoint('/questions?limit=2');
    console.log(`Status: ${questions.status}`);
    console.log('Response:', questions.data);
    console.log('');

    console.log('✅ Tests completed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

runTests();