"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Report_1 = __importDefault(require("../models/Report"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const Budget_1 = __importDefault(require("../models/Budget"));
const TaxEstimate_1 = __importDefault(require("../models/TaxEstimate"));
const auth_1 = require("../middleware/auth");
const json2csv_1 = require("json2csv");
const puppeteer_1 = __importDefault(require("puppeteer"));
const router = express_1.default.Router();
// Generate financial report
router.post('/generate', auth_1.authenticateToken, async (req, res) => {
    try {
        const { period, report_type = 'summary', format = 'json' } = req.body;
        let startDate, endDate;
        if (period.includes('Q')) {
            // Quarterly report
            const year = new Date().getFullYear();
            const quarter = period.split(' ')[1];
            const quarterDates = getQuarterDates(year, quarter);
            startDate = quarterDates.start;
            endDate = quarterDates.end;
        }
        else {
            // Monthly report
            const [month, year] = period.split(' ');
            startDate = new Date(parseInt(year), getMonthNumber(month) - 1, 1);
            endDate = new Date(parseInt(year), getMonthNumber(month), 0);
        }
        // Gather data
        const transactions = await Transaction_1.default.find({
            user_id: req.user._id,
            date: { $gte: startDate, $lte: endDate }
        });
        const budgets = await Budget_1.default.find({
            user_id: req.user._id,
            month: `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`
        });
        const taxEstimates = await TaxEstimate_1.default.find({
            user_id: req.user._id,
            year: startDate.getFullYear()
        });
        // Calculate summary statistics
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        const netIncome = income - expenses;
        // Category breakdown
        const categoryBreakdown = transactions.reduce((acc, transaction) => {
            if (!acc[transaction.category]) {
                acc[transaction.category] = { income: 0, expense: 0 };
            }
            acc[transaction.category][transaction.type] += transaction.amount;
            return acc;
        }, {});
        // Budget performance
        const budgetPerformance = await Promise.all(budgets.map(async (budget) => {
            const spent = transactions
                .filter(t => t.type === 'expense' && t.category === budget.category)
                .reduce((sum, t) => sum + t.amount, 0);
            return {
                category: budget.category,
                budgeted: budget.limit,
                spent,
                remaining: budget.limit - spent,
                percentage: (spent / budget.limit) * 100
            };
        }));
        // Tax summary
        const taxSummary = taxEstimates.map(estimate => ({
            quarter: estimate.quarter,
            estimatedTax: estimate.estimated_tax,
            income: estimate.income_total,
            deductions: estimate.deductions_total,
            status: estimate.status
        }));
        const reportData = {
            period,
            report_type,
            generated_at: new Date(),
            summary: {
                totalIncome: income,
                totalExpenses: expenses,
                netIncome,
                transactionCount: transactions.length
            },
            categoryBreakdown,
            budgetPerformance,
            taxSummary,
            transactions: report_type === 'detailed' ? transactions : undefined
        };
        // Save report to database
        const report = new Report_1.default({
            user_id: req.user._id,
            period,
            report_type,
            data: reportData
        });
        await report.save();
        if (format === 'csv') {
            const csv = await generateCSV(reportData);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="taxpal-report-${period}.csv"`);
            return res.send(csv);
        }
        else if (format === 'pdf') {
            const pdfBuffer = await generatePDF(reportData);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="taxpal-report-${period}.pdf"`);
            return res.send(pdfBuffer);
        }
        res.json({
            message: 'Report generated successfully',
            report: reportData,
            reportId: report._id
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error generating report', error });
    }
});
// Get all reports for user
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const reports = await Report_1.default.find({ user_id: req.user._id })
            .sort({ generated_at: -1 })
            .select('period report_type generated_at _id');
        res.json(reports);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching reports', error });
    }
});
// Get specific report
router.get('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const report = await Report_1.default.findOne({
            _id: req.params.id,
            user_id: req.user._id
        });
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.json(report);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching report', error });
    }
});
// Helper functions
function getQuarterDates(year, quarter) {
    const quarterMap = {
        'Q1': { start: 1, end: 3 },
        'Q2': { start: 4, end: 6 },
        'Q3': { start: 7, end: 9 },
        'Q4': { start: 10, end: 12 }
    };
    const { start: startMonth, end: endMonth } = quarterMap[quarter];
    return {
        start: new Date(year, startMonth - 1, 1),
        end: new Date(year, endMonth, 0)
    };
}
function getMonthNumber(monthName) {
    const months = {
        'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
        'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    };
    return months[monthName] || 1;
}
async function generateCSV(data) {
    const transactions = data.transactions || [];
    const fields = ['date', 'type', 'category', 'amount', 'description'];
    const parser = new json2csv_1.Parser({ fields });
    return parser.parse(transactions);
}
async function generatePDF(data) {
    const browser = await puppeteer_1.default.launch();
    const page = await browser.newPage();
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>TaxPal Financial Report - ${data.period}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { background: #f5f5f5; padding: 20px; margin-bottom: 20px; }
        .section { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>TaxPal Financial Report</h1>
        <h2>${data.period}</h2>
        <p>Generated on ${data.generated_at.toLocaleDateString()}</p>
      </div>
      
      <div class="summary">
        <h3>Summary</h3>
        <p><strong>Total Income:</strong> $${data.summary.totalIncome.toFixed(2)}</p>
        <p><strong>Total Expenses:</strong> $${data.summary.totalExpenses.toFixed(2)}</p>
        <p><strong>Net Income:</strong> $${data.summary.netIncome.toFixed(2)}</p>
        <p><strong>Transaction Count:</strong> ${data.summary.transactionCount}</p>
      </div>
      
      ${data.categoryBreakdown ? `
      <div class="section">
        <h3>Category Breakdown</h3>
        <table>
          <tr><th>Category</th><th>Income</th><th>Expenses</th></tr>
          ${Object.entries(data.categoryBreakdown).map(([category, amounts]) => `<tr><td>${category}</td><td>$${amounts.income.toFixed(2)}</td><td>$${amounts.expense.toFixed(2)}</td></tr>`).join('')}
        </table>
      </div>
      ` : ''}
    </body>
    </html>
  `;
    await page.setContent(html);
    const pdf = await page.pdf({ format: 'A4' });
    await browser.close();
    return pdf;
}
exports.default = router;
//# sourceMappingURL=reports.js.map