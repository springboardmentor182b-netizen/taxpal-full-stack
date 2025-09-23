// server/src/server.ts
// --- load .env before anything else ---
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const candidates = [
  path.resolve(process.cwd(), '.env'),       // when running from /server with cwd=server
  path.resolve(__dirname, '../.env'),        // /server/.env
  path.resolve(__dirname, '../../.env'),     // repo-root/.env  ✅ your current case
];

console.log('[debug] SMTP_HOST=', process.env.SMTP_HOST || '(none)');
console.log('[debug] SMTP_USER=', process.env.SMTP_USER ? '(set)' : '(none)');
console.log('[debug] GMAIL_USER=', process.env.GMAIL_USER ? '(set)' : '(none)');


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
// 1) Load .env BEFORE any other imports (especially before mailer)
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { verifyMailer } from './utils/mailer';

import authRoutes from './api/auth/auth-route';
import incomeRoutes from './api/income/income.routes';
import expenseRoutes from './api/expense/expense.routes';

const app = express();
const PORT = Number(process.env.PORT || 3000);

// ---------- Middleware ----------
/**
 * If you set multiple origins in CORS_ORIGIN (comma-separated),
 * this will allow all of them. Otherwise defaults to localhost:4200.
 */
const corsOrigins =
  process.env.CORS_ORIGIN?.split(',').map(s => s.trim()) || ['http://localhost:4200'];
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- DB connection ----------
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taxpal')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// ---------- Routes (use ONLY v1 prefix) ----------
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/incomes', incomeRoutes);
app.use('/api/v1/expenses', expenseRoutes);
app.use('/api/v1/budgets', budgetRoutes);

// ---------- Health check ----------
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'TaxPal API is running' });
});

// ---------- Route inspector (DEV ONLY) ----------
app.get('/__routes', (_req, res) => {
  const stack: any[] = (app as any)._router?.stack || [];
  const routes: string[] = [];

  stack.forEach((l: any) => {
    if (l.route && l.route.path) {
      const methods = Object.keys(l.route.methods).join(',').toUpperCase();
      routes.push(`${methods} ${l.route.path}`);
    } else if (l.name === 'router' && l.handle?.stack) {
      const prefix =
        l.regexp?.toString().replace(/^\/\^\\/, '/').replace(/\\\/\?\(\?\=\/\|\$\)\/i$/, '') || '';
      l.handle.stack.forEach((s: any) => {
        if (s.route) {
          const methods = Object.keys(s.route.methods).join(',').toUpperCase();
          routes.push(`${methods} ${prefix}${s.route.path}`);
        }
      });
    }
  });

  res.json({ routes });
});

// ---------- START SERVER (single listen + guard) ----------
if (!(global as any).__taxpal_server_started) {
  const server = app.listen(PORT, () => {
    (global as any).__taxpal_server_started = true;
    console.log(`TaxPal server running on port ${PORT}`);
    // Verify mailer AFTER env is loaded
    verifyMailer(); // logs whether SMTP is ready or if you're in DEV log mode
  });

  // Optional graceful shutdown
  const shutdown = () => server.close(() => process.exit(0));
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
} else {
  console.log('[server] listen skipped (already started)');
}

export default app;

