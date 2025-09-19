const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// API routes
app.use('/api/users', require('./routes/user'));

// ...existing code for other routes...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));