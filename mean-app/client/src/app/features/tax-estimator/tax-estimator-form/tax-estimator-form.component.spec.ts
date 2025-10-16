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
