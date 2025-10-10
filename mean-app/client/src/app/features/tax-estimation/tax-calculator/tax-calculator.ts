import { Component } from '@angular/core';

@Component({
  selector: 'app-tax-calculator',
  imports: [],
  templateUrl: './tax-calculator.html',
  styleUrl: './tax-calculator.css'
})
export class TaxCalculator {
  estimatedTax: number = 0;
  income: number = 0;
  taxRate: number = 0;

  calculateTax() {
    this.estimatedTax = this.income * this.taxRate;
  }

}
