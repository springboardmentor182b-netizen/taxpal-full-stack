import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://sarithavijayakumar24_db_user:0dOKIevk2DCfPmi0@cluster0.77ewkcb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
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
