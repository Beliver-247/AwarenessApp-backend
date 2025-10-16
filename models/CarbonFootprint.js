import mongoose from "mongoose";

const CarbonFootprintSchema = new mongoose.Schema({
  userId: { type: String }, 
  transportation: {
    carKm: Number,
    vanKm: Number,
    busKm: Number,
    trainKm: Number
  },
  electricity: {
    kwh: Number
  },
  multipliers: {
    type: Object,
    default: {
      carKm: 0.21,
      vanKm: 0.25,
      busKm: 0.1,
      trainKm: 0.05,
      kwh: 0.5
    }
  },
  total: { type: Number, required: true },
  level: { type: String, enum: ['low', 'middle', 'high'], required: true },
  createdAt: { type: Date, default: Date.now }
});


const CarbonFootprint = mongoose.model("CarbonFootprint", CarbonFootprintSchema, "carbon_footprint_records");

export default CarbonFootprint;


export { CarbonFootprintSchema };
