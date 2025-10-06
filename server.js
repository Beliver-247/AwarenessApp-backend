import express from "express";
import cors from "cors"; // Import cors
import airQualityRoutes from "./Routes/airQualityRoutes.js";
import carbonFootprintRoutes from "./Routes/carbonFootprintRoutes.js";
import NewsRoutes from "./news/index.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// CORS middleware - add this before your routes
app.use(cors({
  origin: ['http://localhost:8081', 'exp://*.*.*.*:*', 'http://*.*.*.*:*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/air-quality", airQualityRoutes);
app.use("/api/carbon-footprint", carbonFootprintRoutes);
app.use("/api/news", NewsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));