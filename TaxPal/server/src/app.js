require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
// Import the tax estimator controller
const taxEstimateController = require("./apis/TaxEstimator/taxestimate.controller");

const app = express();

// Enhanced CORS configuration
app.use(
  cors({
    origin: ["http://localhost:4200", "http://localhost:5173"], // Allow Angular/Vite dev ports
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Request body:", req.body);
  next();
});

// Test route
app.get("/", (req, res) => {
  res.json({ status: "success", message: "TaxPal API is running" });
});

// Tax Estimator routes - Make sure these match what the Angular client expects
app.post("/api/TaxEstimator/calculate", (req, res) => {
  try {
    // Extract data from request body
    const taxData = req.body;
    console.log("Received tax calculation request:", taxData);

    // Basic validation
    if (!taxData || typeof taxData.income === "undefined") {
      return res.status(400).json({
        success: false,
        message: "Invalid request data - income is required",
      });
    }

    // Simple tax calculation (replace with actual calculation)
    const income = Number(taxData.income) || 0;
    const businessExpenses = Number(taxData.businessExpenses) || 0;
    const retirement = Number(taxData.retirement) || 0;
    const healthInsurance = Number(taxData.healthInsurance) || 0;
    const homeOffice = Number(taxData.homeOffice) || 0;

    // Calculate deductions
    const totalDeductions =
      businessExpenses + retirement + healthInsurance + homeOffice;
    const taxableIncome = Math.max(0, income - totalDeductions);

    // Simple tax rate based on income
    let federalTax = 0;
    if (taxableIncome <= 10000) federalTax = taxableIncome * 0.1;
    else if (taxableIncome <= 40000)
      federalTax = 1000 + (taxableIncome - 10000) * 0.15;
    else if (taxableIncome <= 80000)
      federalTax = 5500 + (taxableIncome - 40000) * 0.25;
    else federalTax = 15500 + (taxableIncome - 80000) * 0.3;

    // Mock state tax
    const stateTax = taxableIncome * 0.05;

    // Mock self employment tax
    const selfEmploymentTax = taxableIncome * 0.15;

    // Calculate total tax
    const totalTax = federalTax + stateTax + selfEmploymentTax;

    // Calculate effective tax rate
    const effectiveTaxRate = income > 0 ? (totalTax / income) * 100 : 0;

    const result = {
      taxableIncome,
      totalDeductions,
      totalTax,
      effectiveTaxRate,
      breakdown: {
        federalTax,
        stateTax,
        selfEmploymentTax,
      },
    };

    console.log("Calculated tax result:", result);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error calculating tax:", error);
    res.status(500).json({
      success: false,
      message: "Error calculating tax",
      error: error.message,
    });
  }
});
app.post("/api/TaxEstimator/save", taxEstimateController.saveTaxEstimate);
app.get(
  "/api/TaxEstimator/user/:userId",
  taxEstimateController.getUserTaxEstimates
);

// Tax Events API endpoint
app.get("/api/TaxEstimator/events", (req, res) => {
  console.log("Fetching tax events");

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

  console.log("Returning events:", events);
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
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

// MongoDB connection (Atlas)
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log("Available API endpoints:");
  console.log("- POST /api/TaxEstimator/calculate");
  console.log("- POST /api/TaxEstimator/save");
  console.log("- GET  /api/TaxEstimator/user/:userId");
  console.log("- GET  /api/TaxEstimator/events");
  console.log("- POST /api/TaxEstimator/events");
  console.log("=".repeat(50));
});

module.exports = app;
