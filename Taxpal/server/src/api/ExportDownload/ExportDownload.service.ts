import PDFDocument from 'pdfkit';
import { format as fmt } from 'date-fns';
import { PassThrough } from 'stream';

import FinancialReportModel from '../FinancialReport/FinancialReport.model';
// Try to import optional libs only when needed
async function makeXlsx(rows: any[][], sheetName='Sheet1'): Promise<Buffer> {
  try {
    const XLSX = await import('xlsx');
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    return Buffer.from(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as any);
  } catch {
    throw new Error('XLSX export requires the "xlsx" package. Install it with: npm i xlsx');
  }
}

function makeCsv(rows: any[][]): Buffer {
  const lines = rows.map(r => r.map(v => {
    const s = (v ?? '').toString();
    return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
  }).join(','));
  return Buffer.from(lines.join('\n'), 'utf8');
}

async function getIncomeExpenseTotals(dateFrom: Date, dateTo: Date) {
  // Try reading from Income / Expense collections if they exist; otherwise return zeros.
  let totalIncome = 0, totalExpense = 0;

  try {
    const Income = (await import('../income/Income.model')).default as any;
    const inc = await Income.aggregate([
      { $match: { date: { $gte: dateFrom, $lte: dateTo } } },
      { $group: { _id: null, sum: { $sum: '$amount' } } }
    ]);
    totalIncome = inc?.[0]?.sum || 0;
  } catch { /* ignore if module not present */ }

  try {
    const Expense = (await import('../expense/Expense.model')).default as any;
    const exp = await Expense.aggregate([
      { $match: { date: { $gte: dateFrom, $lte: dateTo } } },
      { $group: { _id: null, sum: { $sum: '$amount' } } }
    ]);
    totalExpense = exp?.[0]?.sum || 0;
  } catch { /* ignore if module not present */ }

  return { totalIncome, totalExpense, net: totalIncome - totalExpense };
}

export async function buildReportBuffer(opts: {
  reportId?: string,
  reportType: 'income-statement'|'balance-sheet'|'cash-flow',
  format: 'pdf'|'csv'|'xlsx'
}) {
  let rep = null as any;
  if (opts.reportId) {
    rep = await FinancialReportModel.findById(opts.reportId).lean();
    if (!rep) throw new Error('Report not found');
  } else {
    throw new Error('reportId is required to export');
  }

  // 🔧 Coerce & validate dates coming from Mongo/lean
  const toValidDate = (v: any, fallback?: Date) => {
    const d = v instanceof Date ? v : new Date(v);
    return isNaN(d.getTime()) ? (fallback ?? new Date()) : d;
  };

  const dateFrom: Date = toValidDate(rep.dateFrom);
  const dateTo: Date   = toValidDate(rep.dateTo);
  if (isNaN(dateFrom.getTime()) || isNaN(dateTo.getTime())) {
    throw new Error('Invalid report dates (dateFrom/dateTo)');
  }

  const periodLabel: string = rep.periodLabel || 'Period';

  const reportType = rep.reportType as 'income-statement'|'balance-sheet'|'cash-flow';

  const { totalIncome, totalExpense, net } =
    await getIncomeExpenseTotals(dateFrom, dateTo);

  const rows: any[][] = [
    ['Report', String(reportType).replace('-', ' ').toUpperCase()],
    ['Period', `${fmt(dateFrom,'dd-MMM-yyyy')} – ${fmt(dateTo,'dd-MMM-yyyy')} (${periodLabel})`],
    [],
    ['Metric','Amount'],
    ['Total Income', totalIncome.toFixed(2)],
    ['Total Expense', totalExpense.toFixed(2)],
    ['Net', net.toFixed(2)]
  ];

  
  if (opts.format === 'csv') {
    return { filename: 'report.csv', mime: 'text/csv', buf: makeCsv(rows) };
  }
  if (opts.format === 'xlsx') {
    const buf = await makeXlsx(rows, 'Report');
    return { filename: 'report.xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buf };
  }

  // Default PDF
  const doc = new PDFDocument({ margin: 40 });
  const stream = new PassThrough();
  const chunks: Buffer[] = [];
  doc.pipe(stream);

  // Header
  doc
    .fontSize(18).fillColor('#25295A').text('Financial Report', { align: 'left' })
    .moveDown(0.2)
    .fontSize(12).fillColor('#1A1A1A')
    .text(`Type: ${String(reportType).replace('-', ' ')}`)
    .text(`Period: ${fmt(dateFrom,'dd-MMM-yyyy')} – ${fmt(dateTo,'dd-MMM-yyyy')} (${periodLabel})`)
    .moveDown(1);

  // Table
  doc.fontSize(12).fillColor('#000000');
  rows.slice(3).forEach(r => {
    if (r.length === 0) doc.moveDown(0.5);
    else {
      doc.text(`${r[0]}: ${r[1]}`);
    }
  });

  doc.end();

  return await new Promise<{ filename:string; mime:string; buf:Buffer }>((resolve, reject) => {
    stream.on('data', (d: Buffer) => chunks.push(d));
    stream.on('end', () => resolve({ filename: 'report.pdf', mime: 'application/pdf', buf: Buffer.concat(chunks) }));
    stream.on('error', reject);
  });
}
