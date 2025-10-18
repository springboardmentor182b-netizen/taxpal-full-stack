import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError } from 'rxjs';

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

/** Backend types */
interface TaxCalcRequest {
  income: number;
  deductions: number;
  taxYear?: number;
}
interface TaxCalcResponse {
  success: boolean;
  data?: { taxableIncome: number; taxAmount: number; effectiveTaxRate: number };
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class TaxEstimatorService {
  private readonly base = '/api/v1/tax';

  constructor(private http: HttpClient) {}

  // --- Static UI data ---
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

  // --- Client-side fallback calculator (kept) ---
  calculateEstimateLocal(v: EstimatorInput): TaxSummary {
    const gross = this.num(v.grossIncome);
    const deductions =
      this.num(v.businessExpenses) +
      this.num(v.retirement) +
      this.num(v.health) +
      this.num(v.homeOffice);

    const taxable = Math.max(0, gross - deductions);

    // Demo flat rates (replace if you want strict parity with backend later)
    let rate = 0.2;
    if (v.country === 'United States') rate = 0.25;
    if (v.country === 'India') rate = 0.15;
    if (v.country === 'Canada') rate = 0.18;

    const estimatedTax = taxable * rate;
    return { gross, deductions, taxable, estimatedTax };
  }

  /**
   * --- Backend calculator (SAVES a record in DB) ---
   * The backend uses ANNUAL slabs.
   * We send ANNUALIZED inputs (quarter * 4) and then divide the backend result by 4
   * so the UI still shows QUARTERLY numbers.
   */
  calculateEstimateBackend(v: EstimatorInput, taxYear?: number): Observable<TaxSummary> {
    // quarterly inputs from the form
    const grossQ = this.num(v.grossIncome);
    const deductionsQ =
      this.num(v.businessExpenses) +
      this.num(v.retirement) +
      this.num(v.health) +
      this.num(v.homeOffice);

    // annualize for backend slab logic
    const incomeAnnual = grossQ * 4;
    const deductionsAnnual = deductionsQ * 4;

    const payload: TaxCalcRequest = { income: incomeAnnual, deductions: deductionsAnnual, taxYear };

    return this.http.post<TaxCalcResponse>(`${this.base}/calculate`, payload).pipe(
      map((resp) => {
        if (!resp?.success || !resp.data) {
          throw new Error(resp?.message || 'Unknown error from tax calculate API');
        }
        const { taxableIncome, taxAmount } = resp.data;

        // Convert backend annual numbers back to quarterly for the UI
        const taxableQ = Math.max(0, (taxableIncome ?? 0) / 4);
        const taxQ = Math.max(0, (taxAmount ?? 0) / 4);

        return {
          gross: grossQ,                 // show what the user entered (quarterly)
          deductions: deductionsQ,       // quarterly
          taxable: taxableQ,             // quarterly (derived from backend)
          estimatedTax: taxQ,            // quarterly (derived from backend)
        } satisfies TaxSummary;
      })
    );
  }

  // --- Tax Records (optional) ---
  getRecords(): Observable<any[]> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.base}/records`).pipe(
      map((r) => (r?.success ? r.data ?? [] : [])),
      catchError(() => of([]))
    );
  }

  private num(x: any): number {
    const n = Number(x);
    return isNaN(n) ? 0 : n;
  }
}
