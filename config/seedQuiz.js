import { Question } from '../models/Quiz.js';
import mongoose from 'mongoose';

// Sample quiz questions to seed the database
const sampleQuestions = [
  {
    questionText: "What is the main greenhouse gas responsible for climate change?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correctAnswer: 1,
    explanation: "Carbon dioxide (CO2) is the primary greenhouse gas emitted through human activities and is the main driver of climate change.",
    category: "climate",
    difficulty: "easy",
    points: 1
  },
  {
    questionText: "Which of the following is the most effective way to reduce your carbon footprint?",
    options: ["Using LED bulbs", "Eating less meat", "Taking shorter showers", "Recycling paper"],
    correctAnswer: 1,
    explanation: "Reducing meat consumption, especially beef, has a significant impact on reducing greenhouse gas emissions from agriculture.",
    category: "carbon-footprint",
    difficulty: "medium",
    points: 2
  },
  {
    questionText: "What does AQI stand for?",
    options: ["Air Quality Index", "Atmospheric Quality Indicator", "Air Quantity Index", "Atmospheric Quality Index"],
    correctAnswer: 0,
    explanation: "AQI stands for Air Quality Index, which is used to communicate how polluted the air currently is or how polluted it is forecast to become.",
    category: "air-quality",
    difficulty: "easy",
    points: 1
  },
  {
    questionText: "Which renewable energy source produces the most electricity globally?",
    options: ["Solar", "Wind", "Hydroelectric", "Geothermal"],
    correctAnswer: 2,
    explanation: "Hydroelectric power is currently the largest source of renewable electricity worldwide, accounting for about 16% of global electricity generation.",
    category: "renewable-energy",
    difficulty: "medium",
    points: 2
  },
  {
    questionText: "What is the Paris Agreement's main goal?",
    options: [
      "Ban all fossil fuels by 2030",
      "Limit global warming to 2°C above pre-industrial levels",
      "Plant 1 billion trees worldwide",
      "Reduce plastic waste by 50%"
    ],
    correctAnswer: 1,
    explanation: "The Paris Agreement aims to limit global warming to well below 2°C, preferably to 1.5°C, compared to pre-industrial levels.",
    category: "climate",
    difficulty: "medium",
    points: 2
  },
  {
    questionText: "Which gas makes up approximately 78% of Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
    correctAnswer: 2,
    explanation: "Nitrogen makes up about 78% of Earth's atmosphere, while oxygen makes up about 21%.",
    category: "air-quality",
    difficulty: "easy",
    points: 1
  },
  {
    questionText: "What is the recommended indoor air quality PM2.5 level according to WHO?",
    options: ["Less than 15 µg/m³", "Less than 25 µg/m³", "Less than 35 µg/m³", "Less than 50 µg/m³"],
    correctAnswer: 0,
    explanation: "The World Health Organization recommends annual mean PM2.5 concentrations should not exceed 15 µg/m³ for indoor air quality.",
    category: "air-quality",
    difficulty: "hard",
    points: 3
  },
  {
    questionText: "Which transportation method has the lowest carbon footprint per kilometer?",
    options: ["Electric car", "Bus", "Bicycle", "Train"],
    correctAnswer: 2,
    explanation: "Bicycles have essentially zero carbon emissions during use, making them the most environmentally friendly transportation method.",
    category: "carbon-footprint",
    difficulty: "easy",
    points: 1
  },
  {
    questionText: "What percentage of global greenhouse gas emissions come from agriculture?",
    options: ["10-15%", "20-25%", "30-35%", "40-45%"],
    correctAnswer: 1,
    explanation: "Agriculture accounts for approximately 24% of global greenhouse gas emissions, making it one of the largest contributors to climate change.",
    category: "climate",
    difficulty: "hard",
    points: 3
  },
  {
    questionText: "Which renewable energy technology has seen the fastest cost reduction in recent years?",
    options: ["Wind power", "Solar photovoltaic", "Hydroelectric", "Biomass"],
    correctAnswer: 1,
    explanation: "Solar photovoltaic (PV) technology has experienced the most dramatic cost reductions, with prices falling by over 80% since 2010.",
    category: "renewable-energy",
    difficulty: "medium",
    points: 2
  },
  {
    questionText: "What percentage of global greenhouse gas emissions come from the transportation sector?",
    options: ["10%", "14%", "24%", "35%"],
    correctAnswer: 2,
    explanation: "Transportation accounts for approximately 24% of global greenhouse gas emissions, making it the second-largest sector after electricity and heat production.",
    category: "climate",
    difficulty: "medium",
    points: 2
  },
  {
    questionText: "Which country is the world's largest producer of solar energy?",
    options: ["Germany", "United States", "China", "Japan"],
    correctAnswer: 2,
    explanation: "China is the world's largest producer of solar energy, accounting for more than 30% of global solar power generation.",
    category: "renewable-energy",
    difficulty: "easy",
    points: 1
  },
  {
    questionText: "What is carbon footprint measured in?",
    options: ["Kilograms", "CO2 equivalent", "Joules", "BTU"],
    correctAnswer: 1,
    explanation: "Carbon footprint is measured in CO2 equivalent, which includes all greenhouse gases converted to the equivalent amount of CO2.",
    category: "carbon-footprint",
    difficulty: "easy",
    points: 1
  },
  {
    questionText: "Which air pollutant is primarily responsible for smog formation?",
    options: ["Carbon monoxide", "Ozone", "Sulfur dioxide", "Particulate matter"],
    correctAnswer: 1,
    explanation: "Ground-level ozone is the primary component of smog and is formed when nitrogen oxides and volatile organic compounds react in sunlight.",
    category: "air-quality",
    difficulty: "medium",
    points: 2
  },
  {
    questionText: "What does 'Net Zero' mean in climate terms?",
    options: [
      "Zero carbon emissions",
      "Balance between emissions produced and removed",
      "Zero energy consumption",
      "Zero waste production"
    ],
    correctAnswer: 1,
    explanation: "Net Zero means achieving a balance between the greenhouse gases emitted and those removed from the atmosphere.",
    category: "climate",
    difficulty: "medium",
    points: 2
  }
];

const seedQuestions = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/awareness-app');
    
    console.log('📦 Connected to MongoDB');
    
    // Clear existing questions
    await Question.deleteMany({});
    console.log('🗑️  Cleared existing questions');
    
    // Insert sample questions
    const questions = await Question.insertMany(sampleQuestions);
    
    console.log(`✅ Successfully seeded ${questions.length} quiz questions to the database`);
    return questions;
  } catch (error) {
    console.error('❌ Error seeding quiz questions:', error);
    throw error;
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

export {
  seedQuestions,
  sampleQuestions
};