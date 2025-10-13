import { Component, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TaxInputs {
  region: 'us' | 'in' | 'ca' | 'uk' | '';
  annualGrossIncome: number | null;
  annualDeductions: number | null;
  filingStatus: 'single' | 'married';
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
  styleUrls: ['./tax-estimator.component.css'] // ✅ Fixed property name
})
export class TaxEstimatorComponent {
  taxInputs = signal<TaxInputs>({
    region: 'us',
    annualGrossIncome: null,
    annualDeductions: null,
    filingStatus: 'single'
  });

  estimatedTaxData = signal<EstimatedTaxData | null>(null);
  isCalculating = signal(false);
  errorMessage = signal('');

  private async fetchWithRetry(url: string, options: RequestInit, maxRetries = 5): Promise<any> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({ message: 'Unknown server error or network issue.' }));
          throw new Error(errorBody.message || `HTTP error! Status: ${response.status}`);
        }
        return await response.json();
      } catch (error: any) {
        if (attempt === maxRetries - 1) throw error;
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Fetch failed after maximum retries.');
  }

  async calculateTax(): Promise<void> {
    this.estimatedTaxData.set(null);
    this.errorMessage.set('');
    this.isCalculating.set(true);

    const inputs = this.taxInputs();
    if (!inputs.annualGrossIncome || inputs.annualGrossIncome <= 0) {
      this.errorMessage.set('Please enter a valid annual gross income greater than zero.');
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

      const result: EstimatedTaxData = await this.fetchWithRetry('/api/tax/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      this.estimatedTaxData.set(result);
    } catch (error: any) {
      console.error('Tax Calculation Failed:', error);
      this.errorMessage.set(`Calculation failed. Server response: ${error.message || 'Check network connection and backend API status.'}`);
    } finally {
      this.isCalculating.set(false);
    }
  }
}
