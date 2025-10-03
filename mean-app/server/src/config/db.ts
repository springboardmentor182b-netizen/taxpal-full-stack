import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load .env
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

// Enable Mongoose debug logging
mongoose.set("debug", true);

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("❌ MONGO_URI is not defined in .env");
}

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error("❌ MongoDB connection error:", error.message);
    console.error(error); // print full error object for more details
    process.exit(1); // stop the app if connection fails
  }
};