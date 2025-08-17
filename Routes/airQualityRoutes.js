import express from "express";
import { fetchAirQuality } from "../controllers/airQualityController.js";

const router = express.Router();

router.get("/air-quality", fetchAirQuality);

export default router;
