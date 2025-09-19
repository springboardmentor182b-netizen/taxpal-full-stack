const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Health check endpoint
app.get('/api/health', (req, res) => {
  const mongooseState = mongoose.connection.readyState;
  // 1 = connected, 2 = connecting, 0 = disconnected, 3 = disconnecting
  res.json({
    mongo: mongooseState === 1 ? 'connected' : 'not connected',
    state: mongooseState
  });
});

// API routes
app.use('/api/users', require('./routes/user'));

// ...existing code for other routes...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));