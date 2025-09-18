import express from 'express';
import { getDashboardData, getIncomeVsExpenses } from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getDashboardData);
router.get('/income-vs-expenses', getIncomeVsExpenses);

export default router;
