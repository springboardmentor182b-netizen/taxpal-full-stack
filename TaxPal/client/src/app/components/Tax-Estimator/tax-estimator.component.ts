import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { TaxService } from '../../services/tax.service';

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
}

@Component({
  selector: 'app-tax-estimator',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './tax-estimator.component.html',
  styleUrls: ['./tax-estimator.component.css'],
})
export class TaxEstimatorComponent {
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
  };

  estimatedTax: number | null = null;
  isCalculating = false;
  errorMessage: string | null = null;
  calculationComplete = false;

  constructor(private taxService: TaxService, private router: Router) {}

  calculateTax() {
    this.isCalculating = true;
    this.errorMessage = null;

    // Create the request payload
    const requestData = {
      userId: 'default-user',
      income: Number(this.taxData.income),
      businessExpenses: Number(this.taxData.businessExpenses),
      retirement: Number(this.taxData.retirement),
      healthInsurance: Number(this.taxData.healthInsurance),
      homeOffice: Number(this.taxData.homeOffice),
      filingStatus: this.taxData.status.toLowerCase(),
      state: this.taxData.state.toUpperCase(),
      quarter: this.taxData.quarter,
    };

    console.log('Sending tax calculation request:', requestData);

    this.taxService.calculateTax(requestData).subscribe({
      next: (response) => {
        console.log('Tax calculation response:', response);
        this.estimatedTax = response.totalTax;
        this.isCalculating = false;
        this.calculationComplete = true;
      },
      error: (error) => {
        console.error('Error calculating tax:', error);
        this.errorMessage = 'Unable to calculate tax. Please try again later.';
        this.isCalculating = false;
      },
    });
  }

  viewCalendar() {
    this.router.navigate(['/tax-calendar']);
  }
}
