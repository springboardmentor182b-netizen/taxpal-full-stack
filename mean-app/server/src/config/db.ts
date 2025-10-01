import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://rupak:rupak2003@cluster0.fcbka.mongodb.net/Taxpal",
      {
              maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      }
    );
    console.log("✅ MongoDB connected (Atlas)");
  } catch (err) {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  }
};
