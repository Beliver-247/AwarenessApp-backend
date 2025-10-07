// Seed default multipliers for carbon footprint calculation
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Multiplier = require("../models/Multiplier.js");

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/awareness-app";

const defaultMultipliers = [
  { key: "carKm", value: 0.21 },
  { key: "vanKm", value: 0.25 },
  { key: "busKm", value: 0.1 },
  { key: "trainKm", value: 0.05 },
  { key: "kwh", value: 0.5 },
];

async function seedMultipliers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    for (const m of defaultMultipliers) {
      await Multiplier.updateOne({ key: m.key }, { $set: m }, { upsert: true });
    }

    console.log("🌱 Multipliers seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding multipliers:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

seedMultipliers();
