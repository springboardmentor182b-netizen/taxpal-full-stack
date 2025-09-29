const DashboardService = require('../dashboard/dashboard.service');
const dashboardService = new DashboardService();

class DashboardController {
    async getSummary(req, res) {
        try {
            const userId = req.body.user_id;
            const summary = await dashboardService.getSummary(userId);
            res.json(summary);
        } catch (error) {
            console.error('Error fetching dashboard summary:', error);
            res.status(500).json({ error: 'Error fetching dashboard summary' });
        }
    }
}

module.exports = DashboardController;
