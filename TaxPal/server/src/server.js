const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Load .env
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(express.json());

// Enable CORS for frontend
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:4200',
    credentials: true
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Atlas connected successfully'))
.catch(err => console.error('MongoDB Atlas connection error:', err));

// Routes (correct paths)
const transactionRoutes = require('./apis/incomeExpenseapi/transactionsRoute');
const dashboardRoutes   = require('./apis/dashboard/dashboard.routes');
const userRoutes        = require('./apis/user/user.routes');
const authRoutes        = require('./apis/auth/auth');
const categoriesRoutes  = require('./apis/Categories/categoriesRoutes');
const budgetRoutes      = require('./apis/budget/budget.route');

// Mount routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/user', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/budget', budgetRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to TaxPal API 🚀');
});

// Swagger docs
const swaggerDocs = require("./config/swagger");
swaggerDocs(app);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
