// Import routes AFTER requiring dotenv
const userRoutes = require('./routes/user');
const taxEstimatorRoutes = require('./routes/taxEstimator');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize Express
const app = express();

// Middleware - MUST come before routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/taxpal')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Register routes
app.use('/api/users', userRoutes);
app.use('/api/tax-estimator', taxEstimatorRoutes);

console.log('✓ Server routes registered:');
console.log('  - /api/users');
console.log('  - /api/tax-estimator');

// Root route
app.get('/', (req, res) => {
  res.send('TaxPal API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test tax estimator at http://localhost:${PORT}/api/tax-estimator/calculate`);
});