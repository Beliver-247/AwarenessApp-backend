import express from "express";
import { fetchAirQuality, fetchHistoricalAirQuality, predictAirQuality } from "../controllers/airQualityController.js";

const router = express.Router();

router.get("/get", fetchAirQuality);
router.get("/history", fetchHistoricalAirQuality);
router.get("/predict", predictAirQuality);

export default router;
