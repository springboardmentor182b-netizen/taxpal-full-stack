
export enum ReportType {
  INCOME_STATEMENT = "Income Statement",
  EXPENSE_REPORT = "Expense Report",
  TAX_SUMMARY = "Tax Summary",
  BUDGET_ANALYSIS = "Budget Analysis",
  CASH_FLOW = "Cash Flow Statement"
}

export enum ReportPeriod {
  CURRENT_MONTH = "Current Month",
  LAST_MONTH = "Last Month",
  CURRENT_QUARTER = "Current Quarter",
  LAST_QUARTER = "Last Quarter",
  CURRENT_YEAR = "Current Year",
  LAST_YEAR = "Last Year",
  CUSTOM = "Custom"
}

export enum ReportFormat {
  PDF = "PDF",
  EXCEL = "Excel",
  CSV = "CSV"
}

export enum ReportStatus {
  PENDING = "pending",
  GENERATING = "generating",
  COMPLETED = "completed",
  FAILED = "failed"
}

export interface IReportData {
  summary?: {
    totalIncome?: number;
    totalExpense?: number;
    netIncome?: number;
    taxLiability?: number;
  };
  details?: any[];
  charts?: any[];
  period?: {
    startDate: Date;
    endDate: Date;
  };
}

export interface IReport {
  _id?: string;
  userId: string;
  reportType: ReportType;
  period: ReportPeriod;
  format: ReportFormat;
  status: ReportStatus;
  reportData?: IReportData;
  customPeriod?: {
    startDate: Date;
    endDate: Date;
  };
  generatedAt?: Date;
  fileUrl?: string;
  fileName?: string;
  errorMessage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}