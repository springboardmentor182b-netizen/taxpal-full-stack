const DashboardService = require('./dashboard.service');
const dashboardService = new DashboardService();

class DashboardController {
    async getSummary(req, res) {
        try {
            const userId = req.user.id;
            const summary = await dashboardService.getSummary(userId);
            res.json(summary);
        } catch (error) {
            console.error('Error fetching dashboard summary:', error);
            res.status(500).json({ error: 'Error fetching dashboard summary' });
        }
    }

    async getRecentTransactions(req, res) {
        try {
            const userId = req.user.id;
            const limit = parseInt(req.query.limit) || 5;
            const transactions = await dashboardService.getRecentTransactions(userId, limit);
            res.json(transactions);
        } catch (error) {
            console.error('Error fetching recent transactions:', error);
            res.status(500).json({ error: 'Error fetching recent transactions' });
        }
    }

    async getExpenseBreakdown(req, res) {
        try {
            const userId = req.user.id;
            const breakdown = await dashboardService.getExpenseBreakdown(userId);
            res.json(breakdown);
        } catch (error) {
            console.error('Error fetching expense breakdown:', error);
            res.status(500).json({ error: 'Error fetching expense breakdown' });
        }
    }

    async getBudgetProgress(req, res) {
        try {
            const userId = req.user.id;
            const budgetProgress = await dashboardService.getBudgetProgress(userId);
            res.json(budgetProgress);
        } catch (error) {
            console.error('Error fetching budget progress:', error);
            res.status(500).json({ error: 'Error fetching budget progress' });
        }
    }

    async getTaxEstimation(req, res) {
        try {
            const userId = req.user.id;
            const taxYear = parseInt(req.query.year) || new Date().getFullYear();
            const taxEstimation = await dashboardService.getTaxEstimation(userId, taxYear);
            res.json(taxEstimation);
        } catch (error) {
            console.error('Error fetching tax estimation:', error);
            res.status(500).json({ error: 'Error fetching tax estimation' });
        }
    }
}

module.exports = DashboardController;
