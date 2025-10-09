import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


import userRoutes from './api/modules/user/user.routes.js';
import transactionRoutes from './api/modules/transactions/transaction.routes.js';
import dashboardRoutes from './api/modules/dashboard/dashboard.routes.js';
import budgetRoutes from './api/modules/budget/budget.routes.js';
import taxRoutes from './api/modules/tax/taxEstimator.routes.js';

dotenv.config();

const app = express();

// middleware
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());

// routes
app.use('/api/auth', userRoutes);
app.use('/api/transactions', transactionRoutes); 
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/tax', taxRoutes);

// test route
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running 🚀' });
});

export default app;
