import FinancialReport, { IFinancialReport, ReportFormat, ReportPeriod, ReportType } from './FinancialReport.model';

function startOfMonth(d: Date){ return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d: Date){ return new Date(d.getFullYear(), d.getMonth()+1, 0, 23,59,59,999); }
function startOfQuarter(d: Date){
  const q = Math.floor(d.getMonth()/3)*3;
  return new Date(d.getFullYear(), q, 1);
}
function endOfQuarter(d: Date){
  const s = startOfQuarter(d);
  return new Date(s.getFullYear(), s.getMonth()+3, 0, 23,59,59,999);
}
function startOfYear(d: Date){ return new Date(d.getFullYear(),0,1); }
function endOfYear(d: Date){ return new Date(d.getFullYear(),11,31,23,59,59,999); }

export function resolvePeriod(period: ReportPeriod){
  const now = new Date();
  let dateFrom = startOfMonth(now);
  let dateTo = endOfMonth(now);
  let label = 'Current Month';

  if (period === 'last-month') {
    const lm = new Date(now.getFullYear(), now.getMonth()-1, 15);
    dateFrom = startOfMonth(lm);
    dateTo = endOfMonth(lm);
    label = 'Last Month';
  } else if (period === 'this-quarter') {
    dateFrom = startOfQuarter(now);
    dateTo = endOfQuarter(now);
    label = 'This Quarter';
  } else if (period === 'this-year') {
    dateFrom = startOfYear(now);
    dateTo = endOfYear(now);
    label = 'This Year';
  }

  return { dateFrom, dateTo, label };
}

export async function createReport(
  reportType: ReportType,
  period: ReportPeriod,
  format: ReportFormat,
  createdBy?: string
): Promise<IFinancialReport> {
  const { dateFrom, dateTo, label } = resolvePeriod(period);

  const doc = await FinancialReport.create({
    reportType, period, periodLabel: label, format, dateFrom, dateTo,
    name: `${reportType} — ${label}`,
    createdBy: createdBy || undefined
  });

  return doc;
}

export async function listReports(): Promise<IFinancialReport[]> {
  return FinancialReport.find().sort({ createdAt: -1 }).lean();
}

export async function getReport(id: string) {
  return FinancialReport.findById(id).lean();
}

export async function deleteReport(id: string) {
  return FinancialReport.deleteOne({ _id: id });
}
