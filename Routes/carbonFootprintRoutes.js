const express = require("express");
const {
  calculateFootprint,
  getFootprintHistory,
} = require("../controllers/carbonFootprintController.js");

const router = express.Router();

router.post("/calculate", calculateFootprint);
router.get("/history", getFootprintHistory);

module.exports = router;
