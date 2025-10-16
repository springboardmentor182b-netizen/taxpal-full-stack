//  import dotenv from "dotenv";
// dotenv.config();
// import mongoose from "mongoose";
// import app from "./app";

// if (process.env.NODE_ENV !== "test") {
//   console.log("🚀 Connecting to MongoDB Atlas...");
//   mongoose
//     .connect(process.env.MONGO_URI!)
//     .then(() => console.log("✅ MongoDB connected"))
//     .catch((err) => console.error("❌ MongoDB connection failed:", err));
// } else {
//   console.log("🧪 Skipping MongoDB connection for test environment");
// }
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

import dotenv from "dotenv";
dotenv.config();


import app from "./app";
import { connectDB } from "./config/db";

// Connect to MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
