const FinancialReport = require('./financialReport.model');
const { generateReportFile } = require('./reportFileGenerator');
const {
    REPORT_FORMAT_DATA,
    TRANSACTION_TYPE_INCOME,
    TRANSACTION_TYPE_EXPENSE,
    MONTHS,
    RATING_EXCELLENT,
    RATING_GOOD,
    SUCCESS,
    REPORT_NOT_FOUND
} = require('./constants');

exports.generateReport = async function(data) {
    if (data.format === REPORT_FORMAT_DATA) {
        // Fetch real transaction data from database
        const Transaction = require('../incomeExpenseapi/TransactionModel');
        const year = parseInt(data.period);
        const startDate = new Date(year, 0, 1); // January 1st of the year
        const endDate = new Date(year + 1, 0, 1); // January 1st of next year

        // Get all transactions for the user in the specified year
        const transactions = await Transaction.find({
            userId: data.userId,
            date: { $gte: startDate, $lt: endDate }
        }).sort({ date: 1 });

        const months = MONTHS;

        const monthlyReports = months.map((month, index) => {
            // Filter transactions for this month
            const monthTransactions = transactions.filter(tx => {
                const txDate = new Date(tx.date);
                return txDate.getMonth() === index;
            });

            const income = monthTransactions
                .filter(tx => tx.type === TRANSACTION_TYPE_INCOME)
                .reduce((sum, tx) => sum + tx.amount, 0);

            const expenses = monthTransactions
                .filter(tx => tx.type === TRANSACTION_TYPE_EXPENSE)
                .reduce((sum, tx) => sum + tx.amount, 0);

            const netIncome = income - expenses;
            const transactionCount = monthTransactions.length;
            const avgSize = transactionCount > 0 ? (income + expenses) / transactionCount : 0;

            // Mock budget usage and rating for now (can be enhanced later)
            const budgetUsage = Math.random() * 40 + 60;
            const budget = 7500;
            const rating = netIncome > 0 ? RATING_EXCELLENT : RATING_GOOD;

            return {
                month,
                income,
                expenses,
                netIncome,
                transactions: transactionCount,
                avgSize: Math.round(avgSize),
                budgetUsage: Math.round(budgetUsage),
                budget,
                rating
            };
        });

        const totalIncome = monthlyReports.reduce((sum, m) => sum + m.income, 0);
        const totalExpenses = monthlyReports.reduce((sum, m) => sum + m.expenses, 0);
        const netSavings = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

        const yearSummary = {
            totalIncome,
            totalExpenses,
            netSavings,
            savingsRate
        };

        const yearlyReport = { ...yearSummary, savingRate: savingsRate };

        return {
            [SUCCESS]: true,
            monthlyReports,
            yearSummary,
            yearlyReport
        };
    }

    // Original file generation logic
    const filePath = await generateReportFile(data);
    const report = new FinancialReport({
        ...data,
        filePath
    });
    await report.save();
    return report;
};

exports.listReports = async function(userId) {
    return FinancialReport.find({ userId }).sort({ createdAt: -1 }).limit(20).exec();
};

exports.getReportFilePath = async function(id) {
    const report = await FinancialReport.findById(id).exec();
    if (!report) throw new Error(REPORT_NOT_FOUND);
    return report.filePath;
};
