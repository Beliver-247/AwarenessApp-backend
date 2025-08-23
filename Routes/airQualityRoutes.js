import express from "express";
import { fetchAirQuality, fetchHistoricalAirQuality  } from "../controllers/airQualityController.js";

const router = express.Router();

router.get("/air-quality", fetchAirQuality);
router.get("/air-quality/history", fetchHistoricalAirQuality);

export default router;
