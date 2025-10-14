const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import the controllers
const taxEstimatorController = require("./apis/TaxEstimator/taxestimate.controller");

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// Tax Estimator Routes
app.post("/api/TaxEstimator/calculate", taxEstimatorController.calculateTax);
app.post("/api/TaxEstimator/save", taxEstimatorController.saveTaxEstimate);
app.get(
  "/api/TaxEstimator/user/:userId",
  taxEstimatorController.getUserTaxEstimates
);

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/taxpal", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Tax Events API endpoint
app.get("/api/TaxEstimator/events", (req, res) => {
  // Return tax events
  const events = [
    {
      date: new Date(new Date().getFullYear(), 3, 15), // April 15
      title: "Q1 Tax Payment Due",
      description: "First quarter estimated tax payment deadline",
      type: "payment",
      priority: "high",
    },
    {
      date: new Date(new Date().getFullYear(), 5, 15), // June 15
      title: "Q2 Tax Payment Due",
      description: "Second quarter estimated tax payment deadline",
      type: "payment",
      priority: "high",
    },
    {
      date: new Date(new Date().getFullYear(), 8, 15), // September 15
      title: "Q3 Tax Payment Due",
      description: "Third quarter estimated tax payment deadline",
      type: "payment",
      priority: "high",
    },
    {
      date: new Date(new Date().getFullYear(), 0, 15), // January 15
      title: "Q4 Tax Payment Due",
      description: "Fourth quarter estimated tax payment deadline",
      type: "payment",
      priority: "high",
    },
  ];
  res.json(events);
});

// Save tax events
app.post("/api/TaxEstimator/events", (req, res) => {
  console.log("Saving tax event:", req.body);
  res.status(201).json({
    success: true,
    message: "Tax event saved successfully",
    data: req.body,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
