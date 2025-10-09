const FinancialReport = require('./financialReport.model');
const { generateReportFile } = require('./reportFileGenerator');

exports.generateReport = async function(data) {
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
    if (!report) throw new Error('Report not found');
    return report.filePath;
};
