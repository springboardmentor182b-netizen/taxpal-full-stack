// src/app/core/services/financialReport.constants.ts
import type { FinancialReport } from '@/app/core/services/financialReport.service';

/**
 * Map a high-level category to the appropriate FinancialReport['reportType'].
 * (Only three report types are supported by the service: income-statement, balance-sheet, cash-flow)
 */
export const CATEGORY_TO_REPORT_TYPE_MAP: Record<string, FinancialReport['reportType']> = {
  INCOME:   'income-statement',
  REVENUE:  'income-statement',
  EXPENSE:  'income-statement',
  COST:     'income-statement',
  ASSET:    'balance-sheet',
  LIABILITY:'balance-sheet',
  CASH:     'cash-flow'
} as const;

/**
 * Lightweight mock rows shaped exactly like the FinancialReport interface.
 * Useful for local UI testing when the API is empty.
 */
export const MOCK_REPORTS: FinancialReport[] = [
  {
    _id: '1',
    name: 'Income Statement — Last Month',
    reportType: 'income-statement',
    period: 'last-month',
    periodLabel: 'Last Month',
    format: 'pdf',
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    _id: '2',
    name: 'Balance Sheet — This Quarter',
    reportType: 'balance-sheet',
    period: 'this-quarter',
    periodLabel: 'This Quarter',
    format: 'xlsx',
    createdAt: new Date('2024-01-10').toISOString()
  }
];

/** Human-readable names for report types */
export const REPORT_TYPE_NAMES: Record<FinancialReport['reportType'], string> = {
  'income-statement': 'Income Statement',
  'balance-sheet':    'Balance Sheet',
  'cash-flow':        'Cash Flow'
};

/** Human-readable names for allowed periods */
export const PERIOD_NAMES: Record<FinancialReport['period'], string> = {
  'current-month': 'Current Month',
  'last-month':    'Last Month',
  'this-quarter':  'This Quarter',
  'this-year':     'This Year'
};
