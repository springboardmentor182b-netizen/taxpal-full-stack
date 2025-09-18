import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://rupak:rupak2003@cluster0.fcbka.mongodb.net/Taxpal");
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  }
};
