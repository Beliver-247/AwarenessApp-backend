import express from "express";
import cors from "cors"; // Import cors
import airQualityRoutes from "./Routes/airQualityRoutes.js";
import carbonFootprintRoutes from "./Routes/carbonFootprintRoutes.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));