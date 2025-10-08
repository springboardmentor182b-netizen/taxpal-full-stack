import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TaxEstimatorComponent } from './tax-estimator.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('TaxEstimatorComponent', () => {
  let component: TaxEstimatorComponent;
  let fixture: ComponentFixture<TaxEstimatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxEstimatorComponent, HttpClientTestingModule, FormsModule, CommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TaxEstimatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default tax data', () => {
    expect(component.taxData.country).toBe('United States');
    expect(component.taxData.status).toBe('Single');
    expect(component.estimatedTax).toBeNull();
  });

  it('should calculate estimated tax correctly when valid data is given', () => {
    component.taxData.income = 100000;
    component.taxData.businessExpenses = 10000;
    component.taxData.retirement = 5000;
    component.taxData.healthInsurance = 5000;
    component.taxData.homeOffice = 2000;

    component.calculateTax();

    // Expected: (100000 - (10000 + 5000 + 5000 + 2000)) * 0.15 = 11700
    expect(component.estimatedTax).toBeCloseTo(11700, 0);
  });

  it('should calculate tax as 0 when income and expenses are 0', () => {
    component.taxData.income = 0;
    component.taxData.businessExpenses = 0;
    component.taxData.retirement = 0;
    component.taxData.healthInsurance = 0;
    component.taxData.homeOffice = 0;

    component.calculateTax();
    expect(component.estimatedTax).toBe(0);
  });

  it('should not produce negative tax when deductions exceed income', () => {
    component.taxData.income = 10000;
    component.taxData.businessExpenses = 15000;
    component.taxData.retirement = 1000;

    component.calculateTax();

    // tax should not go below zero
    expect(component.estimatedTax).toBeGreaterThanOrEqual(0);
  });
});
