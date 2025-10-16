import { seedQuestions } from './config/seedQuiz.js';

console.log('🚀 Starting database seeding...');

seedQuestions()
  .then(() => {
    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database seeding failed:', error);
    process.exit(1);
  });