import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaxEstimatorComponent } from './tax-estimator.component';

describe('TaxEstimatorComponent', () => {
  let component: TaxEstimatorComponent;
  let fixture: ComponentFixture<TaxEstimatorComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TaxEstimatorComponent,
        HttpClientTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaxEstimatorComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default taxData', () => {
    expect(component.taxData.country).toBe('United States');
    expect(component.taxData.state).toBe('');
    expect(component.taxData.status).toBe('Single');
    expect(component.taxData.quarter).toBe('Q2');
    expect(component.taxData.income).toBe(0);
    expect(component.taxData.businessExpenses).toBe(0);
    expect(component.taxData.retirement).toBe(0);
    expect(component.taxData.healthInsurance).toBe(0);
    expect(component.taxData.homeOffice).toBe(0);
  });

  it('should initialize estimatedTax as null', () => {
    expect(component.estimatedTax).toBeNull();
  });

  it('should calculate tax correctly', () => {
    component.taxData.income = 10000;
    component.taxData.businessExpenses = 2000;
    component.taxData.retirement = 1000;
    component.taxData.healthInsurance = 500;
    component.taxData.homeOffice = 300;

    component.calculateTax();

    const expectedTaxable = 10000 - (2000 + 1000 + 500 + 300);
    const expectedTax = expectedTaxable * 0.15;
    expect(component.estimatedTax).toBe(expectedTax);
  });

  it('should calculate tax with zero deductions', () => {
    component.taxData.income = 10000;
    component.taxData.businessExpenses = 0;
    component.taxData.retirement = 0;
    component.taxData.healthInsurance = 0;
    component.taxData.homeOffice = 0;

    component.calculateTax();

    expect(component.estimatedTax).toBe(10000 * 0.15);
  });

  it('should calculate tax with deductions exceeding income', () => {
    component.taxData.income = 1000;
    component.taxData.businessExpenses = 500;
    component.taxData.retirement = 600;
    component.taxData.healthInsurance = 100;
    component.taxData.homeOffice = 200;

    component.calculateTax();

    const expectedTaxable = 1000 - (500 + 600 + 100 + 200);
    const expectedTax = expectedTaxable * 0.15;
    expect(component.estimatedTax).toBe(expectedTax);
  });
});
