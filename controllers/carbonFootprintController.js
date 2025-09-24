import { calculateCarbonFootprintAsync } from "../services/carbonFootprintService.js";
import CarbonFootprint from "../models/CarbonFootprint.js";

export const calculateFootprint = async (req, res) => {
  try {
    const { transportation, electricity, userId } = req.body;
    const result = await calculateCarbonFootprintAsync({ transportation, electricity });
    let carbonFootprint = (typeof result.total === 'number' && !isNaN(result.total)) ? result.total : 0;
    let allowedLevels = ["low", "middle", "high"];
    let level = allowedLevels.includes(result.level) ? result.level : "low";

    // Save to MongoDB
    const record = new CarbonFootprint({
      userId: userId || null,
      transportation,
      electricity,
      total: carbonFootprint,
      level,
      multipliers: result.multipliers // Save multipliers used
    });
    await record.save();

    res.json({ carbonFootprint, level, multipliers: result.multipliers });
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate carbon footprint" });
  }
};

export const getFootprintHistory = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    const history = await CarbonFootprint.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json({ history });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch carbon footprint history" });
  }
};
