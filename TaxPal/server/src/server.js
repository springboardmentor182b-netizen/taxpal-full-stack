const express = require("express");
const dotenv = require("dotenv");

// Always use absolute path for .env
dotenv.config({ path: __dirname + "/.env" });
console.log("MONGO_URI:", process.env.MONGO_URI); // For debugging

const cors = require("cors");
const connectDB = require("./config/db");
const app = express();

// Quick request logger for debugging
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Connect to MongoDB only if not testing
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// Routes
const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");
const budgetRoutes = require("./routes/budget");
const budgetRoutes = require('./routes/budget');

app.use("/api/budgets", budgetRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use('/api/budget', budgetRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Start server only if run directly
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export app for testing
module.exports = app;
