import express from 'express';
import { getDashboardData, getIncomeVsExpenses } from './dashboardController';
import { authenticateToken } from '../auth/auth';
import { handleValidationErrors } from '../../utils/validators/dashboardValidation';
import { query } from 'express-validator';

const router = express.Router();

router.use(authenticateToken);

// /api/v1/dashboard
router.get(
  '/',
  [
    query('month').optional().isInt({ min: 1, max: 12 }).toInt(),
    query('year').optional().isInt({ min: 2000, max: 2100 }).toInt()
  ],
  handleValidationErrors,
  getDashboardData
);

router.get(
  '/income-vs-expenses',
  [query('period').optional().isIn(['month', 'quarter', 'year'])],
  handleValidationErrors,
  getIncomeVsExpenses
);

export default router;
