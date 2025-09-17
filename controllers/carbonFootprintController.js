// carbonFootprintController.js
import { calculateCarbonFootprint } from "../services/carbonFootprintService.js";

export const calculateFootprint = (req, res) => {
  try {
    const { transportation, electricity } = req.body;
    const total = calculateCarbonFootprint({ transportation, electricity });
    res.json({ carbonFootprint: total });
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate carbon footprint" });
  }
};
