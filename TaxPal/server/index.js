// Load environment variables (do this only once)
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("PORT:", process.env.PORT);
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (choose only ONE of these methods)
// Option 1: Use your connectDB module
const connectDB = require("./db");
connectDB();

// Option 2: Connect directly here (remove this if using Option 1)
// const mongoURI = process.env.MONGODB_URI;
// mongoose
//   .connect(mongoURI)
//   .then(() => console.log("MongoDB connected successfully"))
//   .catch((err) => console.error("❌ MongoDB connection error details:", err));

// Base route
app.get("/", (req, res) => {
  res.send("✅ TaxPal API is running...");
});

// Register routes
app.use("/api/tax-estimator", require("./routes/taxEstimator"));
app.use("/api/users", require("./routes/user"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
