export interface TaxInput {
  income: number;
  deductions?: number;
  taxYear?: number;
}

export interface TaxOutput {
  taxableIncome: number;
  taxAmount: number;
  effectiveTaxRate: number;
}

export interface TaxCalendarInput {
  title: string;
  dueDate: Date;
  description?: string;
}

export interface TaxCalendarOutput extends TaxCalendarInput {
  _id: string;
  createdAt: Date;
}