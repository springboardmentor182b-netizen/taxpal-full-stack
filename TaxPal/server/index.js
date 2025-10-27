const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'TaxPal API Documentation'
}));

console.log('📚 Swagger documentation available at: http://localhost:5000/api-docs');

// Import routes
const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

const reportsRouter = require('./routes/reports');
app.use('/api/reports', reportsRouter);

const taxEstimatorRouter = require('./routes/taxEstimator');
app.use('/api/tax-estimator', taxEstimatorRouter);

console.log('✓ API routes registered:');
console.log('  - /api/users/*');
console.log('  - /api/reports/*');
console.log('  - /api/tax-estimate/*');

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check route
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

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
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`\n✓ API endpoints available:`);
  console.log(`  - POST http://localhost:${PORT}/api/users/signin`);
  console.log(`  - POST http://localhost:${PORT}/api/users/signup`);
  console.log(`  - GET  http://localhost:${PORT}/api/reports/data/:userEmail/:year`);
  console.log(`  - POST http://localhost:${PORT}/api/reports/preview-report`);
  console.log(`  - POST http://localhost:${PORT}/api/reports/generate-report`);
  console.log(`  - GET  http://localhost:${PORT}/api/reports/test`);
  console.log(`  - GET  http://localhost:${PORT}/api-docs\n`);
});