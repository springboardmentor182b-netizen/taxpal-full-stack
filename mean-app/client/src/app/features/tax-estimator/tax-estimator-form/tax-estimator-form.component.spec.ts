import { Component, signal } from '@angular/core';

export class TaxEstimatorFormComponent {
  // Reactive form signal
  taxForm = signal({
    country: '',
    state: '',
    filingStatus: '',
    quarter: '',
    grossIncome: 0,
    deductions: 0,
    retirementContributions: 0,
    healthInsurancePremiums: 0,
    homeOfficeDeduction: 0,
    calculatedTax: 0
  });

  // Example states, statuses, quarters
  states = ['California', 'Texas', 'New York'];
  filingStatuses = ['Single', 'Married', 'Head of Household'];
  quarters = ['Q1 (Jan - Mar)', 'Q2 (Apr - Jun)', 'Q3 (Jul - Sep)', 'Q4 (Oct - Dec)'];

  calculateTax() {
    const form = this.taxForm();
    const taxableIncome = form.grossIncome - (form.deductions + form.retirementContributions + form.healthInsurancePremiums + form.homeOfficeDeduction);
    const tax = taxableIncome > 0 ? taxableIncome * 0.25 : 0; // example 25% rate
    this.taxForm.update(current => ({ ...current, calculatedTax: tax }));
  }

  taxSummaryMessage() {
    return this.taxForm().calculatedTax > 0 
      ? `Your estimated quarterly tax is: ${this.taxForm().calculatedTax}` 
      : 'Fill in the form to calculate tax';
  }

  updateFormField(field: string, value: any) {
    this.taxForm.update(current => ({ ...current, [field]: value }));
  }

  // Placeholder methods
  mainHeader() { return 'Dashboard'; }
  mainSubheader() { return 'Welcome to your tax estimator'; }
  logout() { console.log('Logout clicked'); }
}
