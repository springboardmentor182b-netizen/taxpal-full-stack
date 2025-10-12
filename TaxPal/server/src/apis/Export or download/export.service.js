const ExportReport = require('./export.model');
const FinancialReport = require('./financialReport.model');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Ensure export folder exists
function ensureExportDir() {
  const dir = path.join(__dirname, 'exports');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  return dir;
}

// Fetch real financial data from DB
async function getFinancialData(reportId) {
  const report = await FinancialReport.findById(reportId);
  if (!report) throw new Error('Financial report not found');
  return report; // return the entire document
}

// Generate PDF
async function generatePDF(report, fileName) {
  const dir = ensureExportDir();
  const filePath = path.join(dir, `${fileName}.pdf`);
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.fontSize(18).text('Financial Report Export', { align: 'center' });
  doc.moveDown();

  // Write dynamic data from DB
  Object.keys(report._doc).forEach(key => {
    if (key !== '_id' && key !== '__v') {
      doc.fontSize(12).text(`${key}: ${report[key]}`);
    }
  });

  doc.end();

  return new Promise(resolve => {
    stream.on('finish', () => resolve(filePath));
  });
}

// Generate CSV
async function generateCSV(report, fileName) {
  const dir = ensureExportDir();
  const json2csv = new Parser();
  const csv = json2csv.parse(report.toObject());
  const filePath = path.join(dir, `${fileName}.csv`);
  fs.writeFileSync(filePath, csv);
  return filePath;
}

// Main export logic
exports.exportReport = async function (reportId, userId, format) {
  const report = await getFinancialData(reportId);
  const fileName = `${userId}_${reportId}_${Date.now()}`;
  let filePath;

  if (format === 'pdf') {
    filePath = await generatePDF(report, fileName);
  } else if (format === 'csv') {
    filePath = await generateCSV(report, fileName);
  } else {
    throw new Error('Unsupported export format (use pdf/csv)');
  }

  // Save export record
  const exportRecord = new ExportReport({
    reportId,
    userId,
    exportFormat: format,
    filePath
  });

  await exportRecord.save();
  return exportRecord;
};

// Get file path for download
exports.getExportFilePath = async function (id) {
  const record = await ExportReport.findById(id);
  if (!record) throw new Error('Export record not found');
  return record.filePath;
};
