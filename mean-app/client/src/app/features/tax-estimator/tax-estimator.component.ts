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
  styleUrls: ['./tax-estimator.component.scss']
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

  // ✅ Dynamically generated rolling quarters from today's date
  quarters = this.generateRollingQuarters();

  /** ✅ Function to generate 4 rolling quarters starting from today */
  private generateRollingQuarters() {
    const today = new Date();
    const quarters = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 4; i++) {
      const startMonth = (today.getMonth() + i * 3) % 12;
      const startYear = today.getFullYear() + Math.floor((today.getMonth() + i * 3) / 12);

      const endMonth = (startMonth + 2) % 12;
      const endYear = startYear + Math.floor((startMonth + 2) / 12);

      // Create range like "Oct – Dec 2025" or "Nov 2025 – Jan 2026"
      const range =
        startYear === endYear
          ? ${monthNames[startMonth]} – ${monthNames[endMonth]} ${startYear}
          : ${monthNames[startMonth]} ${startYear} – ${monthNames[endMonth]} ${endYear};

      // Due date → 15th of the next month after quarter end
      const dueDate = new Date(endYear, endMonth + 1, 15);
      const dueDateStr = dueDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      quarters.push({
        name: Q${i + 1},
        range,
        dueDate: dueDateStr
      });
    }

    return quarters;
  }

  private async fetchWithRetry(url: string, options: RequestInit, maxRetries = 5): Promise<any> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({ message: 'Unknown server error' }));
          throw new Error(errorBody.message || HTTP ${response.status});
        }
        return await response.json();
      } catch (error: any) {
        if (attempt === maxRetries - 1) throw error;
        await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
      }
    }
    throw new Error('Fetch failed after retries.');
  }

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

      const result: EstimatedTaxData = await this.fetchWithRetry('/api/tax/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      this.estimatedTaxData.set(result);
    } catch (error: any) {
      this.errorMessage.set(Calculation failed: ${error.message});
    } finally {
      this.isCalculating.set(false);
    }
  }
}