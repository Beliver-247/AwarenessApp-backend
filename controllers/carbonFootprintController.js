const { calculateCarbonFootprintAsync } = require("../services/carbonFootprintService.js");
const CarbonFootprint = require("../models/CarbonFootprint.js");

// @desc    Calculate and save user's carbon footprint
// @route   POST /api/carbon-footprint
// @access  Public
const calculateFootprint = async (req, res) => {
  try {
    const { transportation, electricity, userId } = req.body;

    const result = await calculateCarbonFootprintAsync({ transportation, electricity });

    const carbonFootprint =
      typeof result.total === "number" && !isNaN(result.total) ? result.total : 0;

    const allowedLevels = ["low", "middle", "high"];
    const level = allowedLevels.includes(result.level) ? result.level : "low";

    // Save to MongoDB
    const record = new CarbonFootprint({
      userId: userId || null,
      transportation,
      electricity,
      total: carbonFootprint,
      level,
      multipliers: result.multipliers, // Save multipliers used
    });

    await record.save();

    res.json({
      success: true,
      data: {
        carbonFootprint,
        level,
        multipliers: result.multipliers,
      },
    });
  } catch (error) {
    console.error("Calculate footprint error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to calculate carbon footprint",
    });
  }
};

// @desc    Get user's carbon footprint history
// @route   GET /api/carbon-footprint/history
// @access  Public
const getFootprintHistory = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};

    const history = await CarbonFootprint.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: { history },
    });
  } catch (error) {
    console.error("Get footprint history error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch carbon footprint history",
    });
  }
};

module.exports = {
  calculateFootprint,
  getFootprintHistory,
};
