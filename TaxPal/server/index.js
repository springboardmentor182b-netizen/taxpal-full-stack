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

// Connect to MongoDB
connectDB();

// Test route
app.get('/', (req, res) => {
  res.send('✅ TaxPal API is running...');
});

// API routes
app.use('/api/users', require('./routes/user'));
// Example: app.use('/api/dashboard', require('./routes/dashboard'));
// Example: app.use('/api/transactions', require('./routes/transactions'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
