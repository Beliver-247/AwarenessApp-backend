import fetch from 'node-fetch';

async function testSimple() {
  try {
    console.log('Testing simple endpoint...');
    const response = await fetch('http://localhost:5000/api/quiz/categories');
    console.log('Status:', response.status);
    console.log('Headers:', response.headers.raw());
    const text = await response.text();
    console.log('Response body:', text);
  } catch (error) {
    console.error('Error:', error);
  }
}

testSimple();