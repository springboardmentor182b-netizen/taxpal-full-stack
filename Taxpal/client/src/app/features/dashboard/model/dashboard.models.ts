// Period of the current dashboard window
export interface DashboardPeriod {
  year: number;
  month: number;           // 1..12
  start: string;           // ISO date string
  end: string;             // ISO date string
}

// Top summary cards
export interface DashboardCards {
  income:   { amount: number; changePct: number };
  expenses: { amount: number; changePct: number };
  estimatedTaxDues: number;
  savingsRatePct: number;
}

// Pie breakdown entries
export interface BreakdownEntry {
  category: string;
  amount: number;
}

// A budget item with computed fields from the backend
export interface BudgetView {
  _id: string;
  userId: string;
  month: number;
  year: number;
  category: string;
  limit: number;
  // computed on server:
  spent: number;
  remaining: number;
  usedPct: number;
  // timestamps (mongoose)
  createdAt?: string;
  updatedAt?: string;
}

// Recent transaction item
export type TxType = 'income' | 'expense';
export interface TransactionView {
  _id: string;
  userId: string;
  type: TxType;
  amount: number;
  category: string;
  description?: string;
  date: string;            // ISO date string
  createdAt?: string;
  updatedAt?: string;
}

// Full /api/v1/dashboard response
export interface DashboardResponse {
  period: DashboardPeriod;
  cards: DashboardCards;
  breakdown: {
    byCategory: BreakdownEntry[];
  };
  budgets: BudgetView[];
  recentTransactions: TransactionView[];
}

// /api/v1/dashboard/income-vs-expenses response
export type TrendPeriod = 'month' | 'quarter' | 'year';
export interface Series {
  label: string;           // 'Income' | 'Expenses'
  data: number[];
}
export interface IncomeVsExpensesResponse {
  labels: string[];        // e.g. ['2025-07','2025-08',...]
  series: Series[];        // two datasets
  period: TrendPeriod;
}
