import path from 'path';
import fs from 'fs-extra';
import PDFDocument from 'pdfkit';
import { ReportExport } from './reportexport.model';

const OUTPUT_DIR = path.resolve(process.cwd(), 'tmp/reports');

async function ensureOutputDir() {
  await fs.ensureDir(OUTPUT_DIR);
}

export async function generateReport(user_id: string, period: string, report_type: string): Promise<any> {
  await ensureOutputDir();

  const timestamp = Date.now();
  const fileName = `${report_type}_${period}_${timestamp}.pdf`;
  const filePath = path.join(OUTPUT_DIR, fileName);

  // Generate a simple PDF using pdfkit
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.fontSize(18).text(`Report Type: ${report_type}`, { underline: true });
  doc.moveDown();
  doc.fontSize(12).text(`Reporting Period: ${period}`);
  doc.text(`Generated On: ${new Date().toLocaleString()}`);
  doc.moveDown();
  doc.text('Sample content of the generated report...');
  doc.end();

  await new Promise<void>((resolve, reject) => {
    stream.on('finish', () => resolve());
    stream.on('error', (err) => reject(err));
  });

  // Save report info to MongoDB
  const report = await ReportExport.create({
    user_id,
    period,
    report_type,
    file_path: filePath,
  });

  return report;
}

export async function getReportById(id: string) {
  return ReportExport.findById(id);
}

export async function getReportsByUser(user_id: string) {
  return ReportExport.find({ user_id }).sort({ createdAt: -1 });
}

export async function deleteReport(id: string) {
  const report = await ReportExport.findByIdAndDelete(id);
  if (report && await fs.pathExists(report.file_path)) {
    await fs.remove(report.file_path);
  }
  return report;
}
