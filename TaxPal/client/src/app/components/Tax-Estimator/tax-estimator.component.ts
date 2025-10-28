import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

interface TaxData {
  country: string;
  state: string;
  status: string;
  quarter: string;
  income: number;
  businessExpenses: number;
  retirement: number;
  healthInsurance: number;
  homeOffice: number;
  dueDate?: string; // ISO date string selected by user
}

interface TaxEstimateResponse {
  taxableIncome: number;
  estimatedTax: number;
  effectiveTaxRate: number;
  breakdown?: {
    federalIncomeTax: number;
    selfEmploymentTax: number;
  };
}

@Component({
  selector: 'app-tax-estimator',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, HttpClientModule],
  templateUrl: './tax-estimator.component.html',
  styleUrls: ['./tax-estimator.component.css']
})
export class TaxEstimatorComponent {
  isDarkMode = false;
  taxData: TaxData = {
    country: 'United States',
    state: '',
    status: 'Single',
    quarter: 'Q2',
    income: 0,
    businessExpenses: 0,
    retirement: 0,
    healthInsurance: 0,
    homeOffice: 0,
    dueDate: '' // user-selectable due date
  };

  estimatedTax: number | null = null;
  taxableIncome: number | null = null;
  effectiveRate: number | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  private apiUrl = environment.apiUrl || '/api';
  
  // User data
  userId = '';
  userEmail = '';

  constructor(private http: HttpClient, private router: Router) {
    // Get user info from localStorage
    this.userId = localStorage.getItem('user_id') || '';
    this.userEmail = localStorage.getItem('user_email') || '';

    // Detect dark mode from document
    this.isDarkMode = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark-mode');
  }

  calculateTax() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Prepare request data
    const requestData = {
      country: this.taxData.country,
      state: this.taxData.state,
      status: this.taxData.status,
      quarter: this.taxData.quarter,
      income: this.taxData.income,
      businessExpenses: this.taxData.businessExpenses,
      retirement: this.taxData.retirement,
      healthInsurance: this.taxData.healthInsurance,
      homeOffice: this.taxData.homeOffice,
      dueDate: this.taxData.dueDate || undefined, // include dueDate if specified
      userId: this.userId,
      userEmail: this.userEmail
    };

    console.log('Sending tax calculation request:', requestData);

    // Call the API endpoint
    this.http.post<TaxEstimateResponse>(`${this.apiUrl}/tax-estimator/calculate`, requestData)
      .subscribe({
        next: (response) => {
          console.log('Tax calculation response:', response);
          
          if (response) {
            this.taxableIncome = response.taxableIncome;
            this.estimatedTax = response.estimatedTax;
            this.effectiveRate = response.effectiveTaxRate;
            this.successMessage = 'Tax calculation successful!';
            
            // Automatically save to database after calculation
            this.autoSaveTaxEstimate(response);
          }
          
          this.loading = false;
        },
        error: (error) => {
          console.error('Error calculating tax:', error);
          this.errorMessage = error.error?.message || 'Failed to calculate taxes. Please try again.';
          this.loading = false;
        }
      });
  }

  autoSaveTaxEstimate(calculationResponse: TaxEstimateResponse) {
    if (!this.userEmail) {
      console.log('No user email, skipping auto-save');
      return;
    }

    const saveData = {
      userId: this.userId,
      userEmail: this.userEmail,
      country: this.taxData.country,
      state: this.taxData.state,
      status: this.taxData.status,
      quarter: this.taxData.quarter,
      income: this.taxData.income,
      businessExpenses: this.taxData.businessExpenses,
      retirement: this.taxData.retirement,
      healthInsurance: this.taxData.healthInsurance,
      homeOffice: this.taxData.homeOffice,
      taxableIncome: calculationResponse.taxableIncome,
      estimatedTax: calculationResponse.estimatedTax,
      effectiveRate: calculationResponse.effectiveTaxRate,
      dueDate: this.taxData.dueDate || undefined // persist user chosen due date
    };

    console.log('Auto-saving tax estimate:', saveData);

    this.http.post(`${this.apiUrl}/tax-estimator/save`, saveData)
      .subscribe({
        next: (response: any) => {
          console.log('Tax estimate auto-saved:', response);

          // Dispatch a global event so other components (calendar) update
          try {
            const saved = response?.data || response || {};
            const eventDetail: any = {
              id: saved._id || saved.id || saved.insertedId || undefined, // include DB id if available
              userId: this.userId,
              userEmail: this.userEmail,
              quarter: this.taxData.quarter,
              estimatedTax: calculationResponse.estimatedTax,
              taxableIncome: calculationResponse.taxableIncome,
              createdAt: saved.createdAt || new Date().toISOString()
            };
            if (saved.dueDate) eventDetail.dueDate = saved.dueDate;
            else if (this.taxData.dueDate) eventDetail.dueDate = this.taxData.dueDate;
            window.dispatchEvent(new CustomEvent('taxEstimateSaved', { detail: eventDetail }));
          } catch (err) {
            console.warn('Failed to dispatch taxEstimateSaved event', err);
          }
        },
        error: (error) => {
          console.error('Error auto-saving tax estimate:', error);
        }
      });
  }

  resetForm() {
    this.taxData = {
      country: 'United States',
      state: '',
      status: 'Single',
      quarter: 'Q2',
      income: 0,
      businessExpenses: 0,
      retirement: 0,
      healthInsurance: 0,
      homeOffice: 0,
      dueDate: '' // user-selectable due date
    };
    this.estimatedTax = null;
    this.taxableIncome = null;
    this.effectiveRate = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  goBackToCalendar() {
    this.router.navigate(['/tax-calendar']);
  }
}