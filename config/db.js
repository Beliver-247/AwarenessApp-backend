// MongoDB connection setup for AwarenessApp-backend
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/awareness-app";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
