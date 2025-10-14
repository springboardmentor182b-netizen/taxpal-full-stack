require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Enhanced CORS configuration
app.use(
  cors({
    origin: ["http://localhost:4200", "http://localhost:5173"], // Allow Angular/Vite dev ports
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON request bodies with increased limit
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method === "POST" && req.body) {
    console.log("Request body:", JSON.stringify(req.body, null, 2));
  }
  next();
});

// IMPORTANT: The endpoint must match exactly what the client is calling
app.post("/api/TaxEstimator/calculate", (req, res) => {
  try {
    console.log("Processing tax calculation request");
    const taxData = req.body;

    // Basic validation
    if (!taxData) {
      console.error("Missing request body");
      return res.status(400).json({
        success: false,
        message: "Missing request data",
      });
    }

    // Extract values with defaults to avoid NaN issues
    const income = Number(taxData.income) || 0;
    const businessExpenses = Number(taxData.businessExpenses) || 0;
    const retirement = Number(taxData.retirement) || 0;
    const healthInsurance = Number(taxData.healthInsurance) || 0;
    const homeOffice = Number(taxData.homeOffice) || 0;
    const filingStatus = taxData.filingStatus?.toLowerCase() || "single";
    const state = taxData.state?.toUpperCase() || "";

    console.log(
      `Income: ${income}, Filing Status: ${filingStatus}, State: ${state}`
    );

    // Calculate total deductions
    const totalDeductions =
      businessExpenses + retirement + healthInsurance + homeOffice;
    const taxableIncome = Math.max(0, income - totalDeductions);

    // Simple federal tax calculation based on 2023 brackets for single filers
    let federalTax = 0;
    if (filingStatus === "single") {
      if (taxableIncome <= 11000) {
        federalTax = taxableIncome * 0.1;
      } else if (taxableIncome <= 44725) {
        federalTax = 1100 + (taxableIncome - 11000) * 0.12;
      } else if (taxableIncome <= 95375) {
        federalTax = 5147 + (taxableIncome - 44725) * 0.22;
      } else if (taxableIncome <= 182100) {
        federalTax = 16290 + (taxableIncome - 95375) * 0.24;
      } else if (taxableIncome <= 231250) {
        federalTax = 37104 + (taxableIncome - 182100) * 0.32;
      } else if (taxableIncome <= 578125) {
        federalTax = 52832 + (taxableIncome - 231250) * 0.35;
      } else {
        federalTax = 174238.25 + (taxableIncome - 578125) * 0.37;
      }
    } else if (filingStatus === "married") {
      // Simplified married tax brackets
      if (taxableIncome <= 22000) {
        federalTax = taxableIncome * 0.1;
      } else if (taxableIncome <= 89450) {
        federalTax = 2200 + (taxableIncome - 22000) * 0.12;
      } else if (taxableIncome <= 190750) {
        federalTax = 10294 + (taxableIncome - 89450) * 0.22;
      } else {
        federalTax = 32580 + (taxableIncome - 190750) * 0.24;
      }
    }

    // Simple state tax calculation
    const stateRates = {
      CA: 0.093,
      NY: 0.085,
      TX: 0,
      FL: 0,
      NJ: 0.0637,
      PA: 0.0307,
      // Add more states as needed
    };

    const stateRate = stateRates[state] || 0.05; // Default to 5%
    const stateTax = taxableIncome * stateRate;

    // Self-employment tax calculation (15.3% of taxable income)
    const selfEmploymentTax = taxableIncome * 0.153;

    // Calculate total tax and effective tax rate
    const totalTax = federalTax + stateTax + selfEmploymentTax;
    const effectiveTaxRate = income > 0 ? (totalTax / income) * 100 : 0;

    // Format result
    const result = {
      taxableIncome: parseFloat(taxableIncome.toFixed(2)),
      totalDeductions: parseFloat(totalDeductions.toFixed(2)),
      totalTax: parseFloat(totalTax.toFixed(2)),
      effectiveTaxRate: parseFloat(effectiveTaxRate.toFixed(2)),
      breakdown: {
        federalTax: parseFloat(federalTax.toFixed(2)),
        stateTax: parseFloat(stateTax.toFixed(2)),
        selfEmploymentTax: parseFloat(selfEmploymentTax.toFixed(2)),
      },
    };

    console.log("Tax calculation result:", JSON.stringify(result, null, 2));

    // Send successful response
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in tax calculation:", error);
    return res.status(500).json({
      success: false,
      message: "Error calculating tax estimate",
      error: error.message,
    });
  }
});

// Test route
app.get("/", (req, res) => {
  res.json({ status: "success", message: "TaxPal API is running" });
});

// Tax Events API endpoints
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
  console.log("- GET  /api/TaxEstimator/events");
  console.log("- POST /api/TaxEstimator/events");
  console.log("=".repeat(50));
});

module.exports = app;
