import { FinancialReport } from '@/app/features/financial.report/financial.report';

export const CATEGORY_TO_REPORT_TYPE_MAP: { [key: string]: string } = {
  'INCOME': 'INCOME_STATEMENT',
  'EXPENSE': 'EXPENSE_REPORT',
  'ASSET': 'BALANCE_SHEET',
  'LIABILITY': 'BALANCE_SHEET',
  'CASH': 'CASH_FLOW',
  'REVENUE': 'PROFIT_LOSS',
  'COST': 'PROFIT_LOSS'
} as const;

export const MOCK_REPORTS: FinancialReport[] = [
  {
    id: '1',
    name: 'Income Statement - Last Month',
    reportType: 'INCOME_STATEMENT',
    period: 'LAST_MONTH',
    format: 'PDF',
    fileSize: '2.4 MB',
    status: 'COMPLETED',
    generatedDate: new Date('2024-01-15'),
    downloadUrl: '/api/reports/1/download'
  },
  {
    id: '2',
    name: 'Balance Sheet - Current Quarter',
    reportType: 'BALANCE_SHEET',
    period: 'CURRENT_QUARTER',
    format: 'EXCEL',
    fileSize: '1.8 MB',
    status: 'COMPLETED',
    generatedDate: new Date('2024-01-10'),
    downloadUrl: '/api/reports/2/download'
  }
];

export const REPORT_TYPE_NAMES: { [key: string]: string } = {
  'INCOME_STATEMENT': 'Income Statement',
  'BALANCE_SHEET': 'Balance Sheet',
  'CASH_FLOW': 'Cash Flow Statement',
  'PROFIT_LOSS': 'Profit & Loss',
  'EXPENSE_REPORT': 'Expense Report'
};

export const PERIOD_NAMES: { [key: string]: string } = {
  'CURRENT_MONTH': 'Current Month',
  'LAST_MONTH': 'Last Month',
  'CURRENT_QUARTER': 'Current Quarter',
  'LAST_QUARTER': 'Last Quarter',
  'CURRENT_YEAR': 'Current Year',
  'LAST_YEAR': 'Last Year',
  'CUSTOM': 'Custom Range'
};