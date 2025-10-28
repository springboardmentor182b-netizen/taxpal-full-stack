import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { TaxEstimatorComponent } from './tax-estimator.component';
import { environment } from '../../../environments/environment';

describe('TaxEstimatorComponent', () => {
  let component: TaxEstimatorComponent;
  let fixture: ComponentFixture<TaxEstimatorComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaxEstimatorComponent],
      imports: [HttpClientTestingModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TaxEstimatorComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Test Case 1: Tax Calculation Test
  it('should calculate tax successfully and display results', () => {
    component.taxData.income = 50000;
    component.taxData.businessExpenses = 5000;
    component.taxData.retirement = 3000;
    component.taxData.healthInsurance = 2000;
    component.taxData.homeOffice = 1000;

    component.calculateTax();

    const req = httpMock.expectOne(`${environment.apiUrl}/tax-estimator/calculate`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      income: 50000,
      businessExpenses: 5000,
      retirement: 3000,
      healthInsurance: 2000,
      homeOffice: 1000,
      status: 'Single'
    });

    const mockResponse = {
      taxableIncome: 35000,
      estimatedTax: 5250,
      effectiveTaxRate: 10.5,
      breakdown: { federalIncomeTax: 3937.5, selfEmploymentTax: 1312.5 }
    };

    req.flush(mockResponse);

    expect(component.estimatedTax).toBe(5250);
    expect(component.taxableIncome).toBe(35000);
    expect(component.effectiveRate).toBe(10.5);
    expect(component.successMessage).toBe('Tax calculation successful!');
    expect(component.loading).toBe(false);
  });

  // Test Case 2: Form Validation Test
  it('should validate required fields and show error for missing income', () => {
    component.taxData.income = 0; // Missing required income (using 0 instead of null)
    component.taxData.businessExpenses = 1000;

    component.calculateTax();

    const req = httpMock.expectOne(`${environment.apiUrl}/tax-estimator/calculate`);
    expect(req.request.method).toBe('POST');

    const errorResponse = { message: 'Income is required' };
    req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });

    expect(component.errorMessage).toBe('Income is required');
    expect(component.loading).toBe(false);
    expect(component.successMessage).toBe('');
  });

  it('should handle API error responses gracefully', () => {
    component.taxData.income = 50000;

    component.calculateTax();

    const req = httpMock.expectOne(`${environment.apiUrl}/tax-estimator/calculate`);
    expect(req.request.method).toBe('POST');

    req.flush({ message: 'Server error' }, { status: 500, statusText: 'Server Error' });

    expect(component.errorMessage).toBe('Server error');
    expect(component.loading).toBe(false);
  });
});
