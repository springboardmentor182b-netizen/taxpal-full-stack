// ---------- 1) Load .env BEFORE anything else ----------
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

const candidates = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '../../.env'),
];

let loaded = false;
for (const p of candidates) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    console.log('[env] loaded:', p);
    loaded = true;
    break;
  }
}
if (!loaded) console.warn('[env] .env not found; tried:', candidates);

// ---------- 2) Imports that rely on env ----------
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// (optional) mailer verification if you use it
import { verifyMailer } from './utils/mailer';

// ✅ Route modules (use v1 paths consistently)
import authRoutes from './api/auth/auth.routes';
import incomeRoutes from './api/income/income.routes';
import expenseRoutes from './api/expense/expense.routes';
import dashboardRoutes from './api/dashboard/dashboard-routes';
import budgetsRoutes from './api/budget/budget.routes';
import transactionRoutes from './api/transaction/transaction.routes';
import categoriesRoutes from './api/Categories/category.routes';

// ---------- 3) App setup ----------
const app = express();
const PORT = Number(process.env.PORT || 3000);

// Security-ish niceties
app.disable('x-powered-by');

// ---------- 4) CORS ----------
/**
 * CORS_ORIGIN can be a single origin or comma-separated list.
 * Example: CORS_ORIGIN=http://localhost:4200,http://127.0.0.1:4200
 */
const corsOrigins =
  process.env.CORS_ORIGIN?.split(',').map(s => s.trim()) || [
    'http://localhost:4200',
    'http://127.0.0.1:4200',
  ];

app.use(cors({ origin: corsOrigins, credentials: true }));

// ---------- 5) Core middleware ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- 6) DB connection ----------
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taxpal')
  .then(() => console.log('[db] Connected to MongoDB'))
  .catch(err => console.error('[db] connection error:', err));

// ---------- 7) Routes (canonical: /api/v1 prefix) ----------
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/incomes', incomeRoutes);
app.use('/api/v1/expenses', expenseRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/budgets', budgetsRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/categories', categoriesRoutes);

// ---------- 7b) Legacy compatibility mounts (optional) ----------
// These let clients calling '/api/*' (no /v1) still work.
// You can remove once your Angular env points to /api/v1.
app.use('/api/transactions', transactionRoutes);

// Health check (v1 to be consistent with your Angular environment)
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'OK', message: 'TaxPal API is running' });
});

// ---------- 8) Route inspector (DEV ONLY) ----------
app.get('/__routes', (_req, res) => {
  const stack: any[] = (app as any)._router?.stack || [];
  const routes: string[] = [];

  stack.forEach((l: any) => {
    if (l.name === 'router' && l.handle?.stack) {
      const prefix =
        l.regexp?.toString().replace(/^\/\^\\/, '/').replace(/\\\/\?\(\?\=\/\|\$\)\/i$/, '') || '';
      l.handle.stack.forEach((s: any) => {
        if (s.route) {
          const methods = Object.keys(s.route.methods).join(',').toUpperCase();
          routes.push(`${methods} ${prefix}${s.route.path}`);
        }
      });
    } else if (l.route && l.route.path) {
      const methods = Object.keys(l.route.methods).join(',').toUpperCase();
      routes.push(`${methods} ${l.route.path}`);
    }
  });

  res.json({ routes });
});

// ---------- 9) START SERVER (single listen + graceful shutdown) ----------
if (!(global as any).__taxpal_server_started) {
  const server = app.listen(PORT, () => {
    (global as any).__taxpal_server_started = true;
    console.log(`TaxPal server running on http://localhost:${PORT}`);
    try {
      verifyMailer();
    } catch (e) {
      console.warn('[mailer] verify skipped/failed:', (e as Error)?.message);
    }
  });

  const shutdown = () => server.close(() => process.exit(0));
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
} else {
  console.log('[server] listen skipped (already started)');
}

export default app;
