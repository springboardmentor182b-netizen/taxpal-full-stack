import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  templateUrl: './tax-estimator.component.html',
  styleUrls: ['./tax-estimator.component.css']
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
    homeOffice: 0
  };

  estimatedTax: number | null = null;

  constructor(private http: HttpClient) {}

  calculateTax() {
    // Later replace this mock with actual API
    const apiUrl = 'https://api.example.com/calculate-tax';

    // For now, do a local calculation
    const deductions = this.taxData.businessExpenses + this.taxData.retirement + this.taxData.healthInsurance + this.taxData.homeOffice;
    const taxable = this.taxData.income - deductions;
    this.estimatedTax = taxable * 0.15;

    // Example API call for future use
    // this.http.post(apiUrl, this.taxData).subscribe((res: any) => {
    //   this.estimatedTax = res.estimatedTax;
    // });
  }
}
