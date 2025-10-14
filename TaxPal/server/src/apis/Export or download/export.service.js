/**
 * Export Service
 */
const fs = require("fs");
const path = require("path");
// Use correct relative path to access the financial report model
const FinancialReport = require("../financialreports/financialReport.model");

/**
 * Generate and export report
 */
const generateReport = async (reportData) => {
  try {
    // Create a simple mock report for now
    const { userId, reportType, format, dateRange } = reportData;

    // Create reports directory if it doesn't exist
    const reportsDir = path.join(__dirname, "../../../reports");
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    const fileName = `${reportType}_${userId}_${timestamp}.${
      format === "excel" ? "xlsx" : format
    }`;
    const filePath = path.join(reportsDir, fileName);

    // Placeholder for actual report generation logic
    // This would be replaced with actual report generation code
    let content = "";
    if (format === "csv") {
      content = "id,date,amount,description\n1,2023-01-01,100.00,Test entry";
      fs.writeFileSync(filePath, content);
    } else {
      // Mock JSON for PDF or Excel (would be converted to actual format in production)
      content = JSON.stringify(
        {
          reportType,
          userId,
          dateRange,
          generatedAt: new Date(),
          data: [
            {
              id: 1,
              date: "2023-01-01",
              amount: 100,
              description: "Test entry",
            },
          ],
        },
        null,
        2
      );
      fs.writeFileSync(filePath, content);
    }

    // Save report record to database
    const report = new FinancialReport({
      userId,
      reportType,
      dateRange,
      data: { content },
      format,
      filePath,
    });

    await report.save();

    return {
      success: true,
      filePath,
      fileName,
    };
  } catch (error) {
    console.error("Error generating report:", error);
    throw new Error(`Failed to generate report: ${error.message}`);
  }
};

/**
 * Get reports for a user
 */
const getUserReports = async (userId) => {
  try {
    return await FinancialReport.find({ userId }).sort({ generatedAt: -1 });
  } catch (error) {
    throw new Error(`Failed to retrieve user reports: ${error.message}`);
  }
};

module.exports = {
  generateReport,
  getUserReports,
};
