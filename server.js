import express from "express";
import cors from "cors"; // Import cors
import airQualityRoutes from "./Routes/airQualityRoutes.js";
import carbonFootprintRoutes from "./Routes/carbonFootprintRoutes.js";
import NewsRoutes from "./news/index.js";
import quizRoutes from "./Routes/quizRoutes.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// CORS middleware - add this before your routes
app.use(cors({
  origin: ['http://localhost:8081', 'exp://*.*.*.*:*', 'http://*.*.*.*:*', 'http://10.142.132.7:*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/air-quality", airQualityRoutes);
app.use("/api/carbon-footprint", carbonFootprintRoutes);
app.use("/api/news", NewsRoutes);
app.use("/api/quiz", quizRoutes);

console.log('Routes registered:');
console.log('- /api/air-quality');
console.log('- /api/carbon-footprint');
console.log('- /api/news');
console.log('- /api/quiz');

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT} on all interfaces`));