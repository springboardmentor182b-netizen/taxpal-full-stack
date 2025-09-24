import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("❌ MONGO_URI is not defined in .env");
}

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri); // Mongoose 7+ no options needed
    console.log("✅ MongoDB connected");
  } catch (error: any) {
    console.error("❌ MongoDB connection error:", error.message);
  }
};
