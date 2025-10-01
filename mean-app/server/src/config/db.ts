/*import mongoose from "mongoose";

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
*/
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // load environment variables

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI is not defined in .env");
}

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB connected (${process.env.NODE_ENV})`);
  } catch (err) {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  }
};
