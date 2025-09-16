import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth';
import transactionRoutes from './routes/transactions';
import budgetRoutes from './routes/budgets';
import taxRoutes from './routes/tax';
import reportRoutes from './routes/reports';

// NEW: income & expense routes
import incomeRoutes from './routes/income.routes';
import expenseRoutes from './routes/expense.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taxpal')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Existing TaxPal routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/tax', taxRoutes);
app.use('/api/reports', reportRoutes);

// NEW: income & expense routes under /api/v1
app.use('/api/v1/incomes', incomeRoutes);
app.use('/api/v1/expenses', expenseRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'TaxPal API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`TaxPal server running on port ${PORT}`);
});

export default app;
