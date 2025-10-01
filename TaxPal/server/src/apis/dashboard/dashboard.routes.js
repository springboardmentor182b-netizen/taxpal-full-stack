const express = require('express');
const DashboardController = require('./dashboard.controller');
const authMiddleware = require('../auth/authMiddleware');

const router = express.Router();
const dashboardController = new DashboardController();

// Dashboard routes
router.get('/summary', authMiddleware, (req, res) => dashboardController.getSummary(req, res));
router.get('/recent-transactions', authMiddleware, (req, res) => dashboardController.getRecentTransactions(req, res));
router.get('/expense-breakdown', authMiddleware, (req, res) => dashboardController.getExpenseBreakdown(req, res));
router.get('/budget-progress', authMiddleware, (req, res) => dashboardController.getBudgetProgress(req, res));
router.get('/tax-estimation', authMiddleware, (req, res) => dashboardController.getTaxEstimation(req, res));

module.exports = router;
