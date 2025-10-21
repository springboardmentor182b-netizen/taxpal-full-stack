import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TaxEstimatorFormComponent } from './tax-estimator-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

describe('TaxEstimatorFormComponent', () => {
  let component: TaxEstimatorFormComponent;
  let fixture: ComponentFixture<TaxEstimatorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TaxEstimatorFormComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatInputModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaxEstimatorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate tax correctly', () => {
    component.updateFormField('grossIncome', 1000);
    component.updateFormField('deductions', 100);
    component.updateFormField('retirementContributions', 50);
    component.updateFormField('healthInsurancePremiums', 25);
    component.updateFormField('homeOfficeDeduction', 25);

    component.calculateTax();

    expect(component.taxForm().calculatedTax).toBe(200);
  });
});
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
