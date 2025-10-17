const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');

// Load environment variables first
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Import routes
const userRoutes = require('./routes/user');
const taxEstimatorRoutes = require('./routes/taxEstimator');

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Register routes
app.use('/api/users', userRoutes);
app.use('/api/tax-estimator', taxEstimatorRoutes);

console.log('✓ Routes registered:');
console.log('  - /api/users');
console.log('  - /api/tax-estimator');

// Root route
app.get('/', (req, res) => {
  res.send('✅ TaxPal API is running...');
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
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✓ API endpoints available:`);
  console.log(`  - POST http://localhost:${PORT}/api/tax-estimator/calculate`);
  console.log(`  - POST http://localhost:${PORT}/api/tax-estimator/save`);
  console.log(`  - GET  http://localhost:${PORT}/api-docs (if Swagger is configured)`);
});
