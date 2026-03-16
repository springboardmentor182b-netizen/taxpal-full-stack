import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './api/modules/user/user.routes.js';
import transactionRoutes from './api/modules/transactions/transaction.routes.js';
import dashboardRoutes from './api/modules/dashboard/dashboard.routes.js';
import budgetRoutes from './api/modules/budget/budget.routes.js';
import categoriesRouter from './api/modules/categories/categories.routes.js';
import notificationsRouter from "./api/modules/notifications/notifications.routes.js";
import securityRouter from './api/modules/security/security.routes.js';
import taxEstimatorRoutes from './api/modules/tax/taxEstimator.routes.js';
import reportsRoutes from './api/modules/reports/reports.routes.js';

dotenv.config();

const app = express();

// ✅ CORS setup — supports localhost (dev), Vercel (prod), and custom env var
const allowedOrigins = [
  'http://localhost:4200',
  'https://taxpal-full-stack-frontend.onrender.com',
  process.env.CORS_ORIGIN,
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable('etag');

// ✅ Universal no-cache middleware
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// ✅ Routes
app.use('/api/auth', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use('/api/budgets', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
}, budgetRoutes);

app.use('/api/categories', categoriesRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/security', securityRouter);
app.use('/api/tax-estimator', taxEstimatorRoutes);
app.use('/api/reports', reportsRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

// health route
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running 🚀' });
});

export default app;
