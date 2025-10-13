import { Injectable } from '@angular/core';

export interface EstimatorInput {
  country: 'United States' | 'India' | 'Canada' | string;
  state: string;
  status:
    | 'Single'
    | 'Married Filing Jointly'
    | 'Married Filing Separately'
    | 'Head of Household'
    | string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4' | string;
  grossIncome: number;
  businessExpenses: number;
  retirement: number;
  health: number;
  homeOffice: number;
}

export interface TaxSummary {
  gross: number;
  deductions: number;
  taxable: number;
  estimatedTax: number;
}

@Injectable({ providedIn: 'root' })
export class TaxEstimatorService {
  getCountries(): string[] {
    return ['United States', 'India', 'Canada'];
  }

  getStatesByCountry(): Record<string, string[]> {
    return {
      'United States': ['California', 'New York', 'Texas', 'Florida'],
      India: ['Gujarat', 'Maharashtra', 'Karnataka', 'Delhi'],
      Canada: ['Ontario', 'Quebec', 'British Columbia', 'Alberta'],
    };
  }

  getFilingStatuses(): string[] {
    return [
      'Single',
      'Married Filing Jointly',
      'Married Filing Separately',
      'Head of Household',
    ];
  }

  getQuarters(year = 2025): { id: 'Q1' | 'Q2' | 'Q3' | 'Q4'; label: string }[] {
    return [
      { id: 'Q1', label: `Q1 (Jan–Mar ${year})` },
      { id: 'Q2', label: `Q2 (Apr–Jun ${year})` },
      { id: 'Q3', label: `Q3 (Jul–Sep ${year})` },
      { id: 'Q4', label: `Q4 (Oct–Dec ${year})` },
    ];
  }

  calculateEstimate(v: EstimatorInput): TaxSummary {
    const gross = this.num(v.grossIncome);
    const deductions =
      this.num(v.businessExpenses) +
      this.num(v.retirement) +
      this.num(v.health) +
      this.num(v.homeOffice);

    const taxable = Math.max(0, gross - deductions);

    // Demo flat rates (replace with real slabs later)
    let rate = 0.2;
    if (v.country === 'United States') rate = 0.25;
    if (v.country === 'India') rate = 0.15;
    if (v.country === 'Canada') rate = 0.18;

    const estimatedTax = taxable * rate;
    return { gross, deductions, taxable, estimatedTax };
  }

  private num(x: any): number {
    const n = Number(x);
    return isNaN(n) ? 0 : n;
    }
}
