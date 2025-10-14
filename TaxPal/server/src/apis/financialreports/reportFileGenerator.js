/**
 * Report File Generator Module
 * Utility for generating financial reports in various formats
 */
const fs = require("fs");
const path = require("path");

/**
 * Generate a PDF report
 * @param {Object} data - Financial data for the report
 * @param {String} outputPath - Optional custom output path
 * @returns {Promise<String>} - Path to the generated report
 */
const generatePdfReport = async (data, outputPath = null) => {
  try {
    console.log("Generating PDF report with data:", data);

    // Create a simple JSON file for now (in a real app, this would generate PDF)
    const reportContent = JSON.stringify(data, null, 2);
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    const reportsDir = path.join(__dirname, "../../../reports");

    // Create reports directory if it doesn't exist
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const filePath =
      outputPath || path.join(reportsDir, `report_${timestamp}.json`);
    fs.writeFileSync(filePath, reportContent);

    return filePath;
  } catch (error) {
    console.error("Error generating PDF report:", error);
    throw new Error(`Failed to generate PDF report: ${error.message}`);
  }
};

/**
 * Generate a CSV report
 * @param {Object} data - Financial data for the report
 * @param {String} outputPath - Optional custom output path
 * @returns {Promise<String>} - Path to the generated report
 */
const generateCsvReport = async (data, outputPath = null) => {
  try {
    console.log("Generating CSV report with data:", data);

    // Convert data to CSV format
    let csvContent = "";

    // Handle array data
    if (Array.isArray(data) && data.length > 0) {
      // Add headers
      const headers = Object.keys(data[0]);
      csvContent += headers.join(",") + "\n";

      // Add rows
      data.forEach((row) => {
        const values = Object.values(row).map((value) => {
          if (typeof value === "string" && value.includes(",")) {
            return `"${value}"`;
          }
          return value;
        });
        csvContent += values.join(",") + "\n";
      });
    }
    // Handle object data
    else if (data && typeof data === "object") {
      const headers = Object.keys(data);
      const values = Object.values(data).map((value) => {
        if (typeof value === "string" && value.includes(",")) {
          return `"${value}"`;
        }
        return value;
      });

      csvContent += headers.join(",") + "\n";
      csvContent += values.join(",");
    }

    const timestamp = new Date().toISOString().replace(/:/g, "-");
    const reportsDir = path.join(__dirname, "../../../reports");

    // Create reports directory if it doesn't exist
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const filePath =
      outputPath || path.join(reportsDir, `report_${timestamp}.csv`);
    fs.writeFileSync(filePath, csvContent);

    return filePath;
  } catch (error) {
    console.error("Error generating CSV report:", error);
    throw new Error(`Failed to generate CSV report: ${error.message}`);
  }
};

module.exports = {
  generatePdfReport,
  generateCsvReport,
};
