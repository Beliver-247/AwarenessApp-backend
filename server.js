import express from "express";
import airQualityRoutes from "./Routes/airQualityRoutes.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());

// Routes
app.use("/api", airQualityRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
