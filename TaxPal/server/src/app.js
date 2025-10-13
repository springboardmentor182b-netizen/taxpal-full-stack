const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./src/apis/TaxEstimator/taxestimate.route");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

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

// Use tax estimate routes
app.use("/api/tax-estimator", routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
