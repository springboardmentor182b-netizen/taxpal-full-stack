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
