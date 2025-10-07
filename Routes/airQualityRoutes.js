const express = require("express");
const {
  fetchAirQuality,
  fetchHistoricalAirQuality,
  predictAirQuality,
} = require("../controllers/airQualityController.js");

const router = express.Router();

router.get("/get", fetchAirQuality);
router.get("/history", fetchHistoricalAirQuality);
router.get("/predict", predictAirQuality);

module.exports = router;
