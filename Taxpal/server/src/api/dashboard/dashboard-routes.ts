import express from 'express';
import { getDashboardData, getIncomeVsExpenses, getRecentTransactions } from './dashboardController';
import { authenticateToken } from '../auth/auth';
import { handleValidationErrors } from '../../utils/validators/dashboardValidation';
import { query } from 'express-validator';

const router = express.Router();

router.use(authenticateToken);

// GET /api/v1/dashboard?month=&year=
router.get(
  '/',
  [
    query('month').optional().isInt({ min: 1, max: 12 }).toInt(),
    query('year').optional().isInt({ min: 2000, max: 2100 }).toInt()
  ],
  handleValidationErrors,
  getDashboardData
);

// GET /api/v1/dashboard/income-vs-expenses?period=month|quarter|year&month=&year=
router.get(
  '/income-vs-expenses',
  [
    query('period').optional().isIn(['month', 'quarter', 'year']),
    // keep "range" for backward compat if frontend uses ?range=
    query('range').optional().isIn(['month', 'quarter', 'year']),
    query('month').optional().isInt({ min: 1, max: 12 }).toInt(),
    query('year').optional().isInt({ min: 2000, max: 2100 }).toInt()
  ],
  handleValidationErrors,
  getIncomeVsExpenses
);

// GET /api/v1/dashboard/recent?limit=8&startDate=&endDate=
router.get(
  '/recent',
  [
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  handleValidationErrors,
  getRecentTransactions
);

export default router;
