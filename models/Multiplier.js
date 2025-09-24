import mongoose from "mongoose";

const MultiplierSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g., carKm, vanKm, busKm, trainKm, kwh
  value: { type: Number, required: true }
}, { collection: 'carbon_multipliers' });

const Multiplier = mongoose.model("Multiplier", MultiplierSchema);

export default Multiplier;
export { MultiplierSchema };
