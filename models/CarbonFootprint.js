const mongoose = require("mongoose");

const CarbonFootprintSchema = new mongoose.Schema({
  userId: { type: String }, // Optional: for user-specific records
  transportation: {
    carKm: Number,
    vanKm: Number,
    busKm: Number,
    trainKm: Number,
  },
  electricity: {
    kwh: Number,
  },
  multipliers: {
    type: Object,
    default: {
      carKm: 0.21,
      vanKm: 0.25,
      busKm: 0.1,
      trainKm: 0.05,
      kwh: 0.5,
    },
  },
  total: { type: Number, required: true },
  level: { type: String, enum: ["low", "middle", "high"], required: true },
  createdAt: { type: Date, default: Date.now },
});

// Use a custom collection name for carbon footprint records
const CarbonFootprint = mongoose.model(
  "CarbonFootprint",
  CarbonFootprintSchema,
  "carbon_footprint_records"
);

module.exports = CarbonFootprint;
module.exports.CarbonFootprintSchema = CarbonFootprintSchema;
