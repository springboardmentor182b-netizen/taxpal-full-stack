import { Component, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

/** ✅ Constants */
const TAX_API_URL = '/api/tax/calculate';
const MAX_RETRY_ATTEMPTS = 5;
const RETRY_DELAY_BASE_MS = 1000;
const QUARTERS_COUNT = 4;
const DUE_DAY = 15;

export const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const REGION_OPTIONS = [
  { code: 'us', label: 'United States (US)' },
  { code: 'in', label: 'India (IN)' },
  { code: 'ca', label: 'Canada (CA)' },
  { code: 'uk', label: 'United Kingdom (UK)' }
] as const;

export const FILING_STATUSES = [
  { code: 'single', label: 'Single' },
  { code: 'married', label: 'Married' }
] as const;

export const TAX_RESULT_ITEMS = [
  { key: 'taxableIncome', label: 'Taxable Income' },
  { key: 'totalTax', label: 'Total Tax' },
  { key: 'quarterlyPayment', label: 'Quarterly Payment' }
];

/** ✅ Interfaces */
interface TaxInputs {
  region: typeof REGION_OPTIONS[number]['code'] | '';
  annualGrossIncome: number | null;
  annualDeductions: number | null;
  filingStatus: typeof FILING_STATUSES[number]['code'];
}

interface EstimatedTaxData {
  taxableIncome: number;
  totalTax: number;
  quarterlyPayment: number;
}

@Component({
  selector: 'app-tax-estimator',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './tax-estimator.component.html',
  styleUrls: ['./tax-estimator.component.scss']
})
export class TaxEstimatorComponent {
  /** Signals for reactive state */
  taxInputs = signal<TaxInputs>({
    region: 'us',
    annualGrossIncome: null,
    annualDeductions: null,
    filingStatus: 'single'
  });

  estimatedTaxData = signal<EstimatedTaxData | null>(null);
  isCalculating = signal(false);
  errorMessage = signal('');

  /** Dynamically generated quarters */
  quarters = this.generateRollingQuarters();

  /** ✅ Generate next rolling quarters */
  private generateRollingQuarters() {
    const today = new Date();
    const quarters = [];

    for (let i = 0; i < QUARTERS_COUNT; i++) {
      const startMonth = (today.getMonth() + i * 3) % 12;
      const startYear = today.getFullYear() + Math.floor((today.getMonth() + i * 3) / 12);
      const endMonth = (startMonth + 2) % 12;
      const endYear = startYear + Math.floor((startMonth + 2) / 12);

      const range =
        startYear === endYear
          ? `${MONTH_NAMES[startMonth]} – ${MONTH_NAMES[endMonth]} ${startYear}`
          : `${MONTH_NAMES[startMonth]} ${startYear} – ${MONTH_NAMES[endMonth]} ${endYear}`;

      const dueDate = new Date(endYear, endMonth + 1, DUE_DAY);
      const dueDateStr = dueDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      quarters.push({
        name: `Q${i + 1}`,
        range,
        dueDate: dueDateStr
      });
    }

    return quarters;
  }

  /** ✅ Generic fetch with exponential backoff */
  private async fetchWithRetry(url: string, options: RequestInit): Promise<any> {
    for (let attempt = 0; attempt < MAX_RETRY_ATTEMPTS; attempt++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({ message: 'Unknown server error' }));
          throw new Error(errorBody.message || `HTTP ${response.status}`);
        }
        return await response.json();
      } catch (error: any) {
        if (attempt === MAX_RETRY_ATTEMPTS - 1) throw error;
        const delay = Math.pow(2, attempt) * RETRY_DELAY_BASE_MS;
        await new Promise(r => setTimeout(r, delay));
      }
    }
    throw new Error('Fetch failed after all retries.');
  }

  /** ✅ Calculate tax */
  async calculateTax(): Promise<void> {
    this.estimatedTaxData.set(null);
    this.errorMessage.set('');
    this.isCalculating.set(true);

    const inputs = this.taxInputs();
    if (!inputs.annualGrossIncome || inputs.annualGrossIncome <= 0) {
      this.errorMessage.set('Please enter a valid annual gross income.');
      this.isCalculating.set(false);
      return;
    }

    try {
      const payload = {
        region: inputs.region,
        annualGrossIncome: inputs.annualGrossIncome,
        annualDeductions: inputs.annualDeductions ?? 0,
        filingStatus: inputs.filingStatus
      };

      const result: EstimatedTaxData = await this.fetchWithRetry(TAX_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      this.estimatedTaxData.set(result);
    } catch (error: any) {
      this.errorMessage.set(`Calculation failed: ${error.message}`);
    } finally {
      this.isCalculating.set(false);
    }
  }
}
