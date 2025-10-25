import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IncomeForm } from './income-form.component';
import { IncomeService } from '../../../services/income.services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('IncomeForm', () => {
  let component: IncomeForm;
  let fixture: ComponentFixture<IncomeForm>;
  let incomeServiceSpy: jasmine.SpyObj<IncomeService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<IncomeForm>>;

  beforeEach(async () => {
    // Spies
    incomeServiceSpy = jasmine.createSpyObj('IncomeService', ['addIncome']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    // Mock snackBar.open to return a fake MatSnackBarRef
    snackBarSpy.open.and.returnValue({
      onAction: () => of(true),
      afterDismissed: () => of({}),
    } as any);

    await TestBed.configureTestingModule({
      imports: [IncomeForm, ReactiveFormsModule],
      providers: [
        { provide: IncomeService, useValue: incomeServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IncomeForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form as invalid when required fields are empty', () => {
    component.incomeForm.setValue({
      description: '',
      amount: null,
      category: '',
      date: null,
      notes: ''
    });
    component.incomeForm.markAllAsTouched();
    component.incomeForm.updateValueAndValidity();
    fixture.detectChanges();

    expect(component.incomeForm.invalid).toBeTrue();
  });

  it('should call addIncome and show success snackbar on valid form submit', fakeAsync(() => {
    const mockIncome = {
      id: 1,
      description: 'Freelance',
      amount: 2000,
      category: 'Freelance',
      date: new Date('2025-10-22'),
      notes: ''
    };

    incomeServiceSpy.addIncome.and.returnValue(of({ income: mockIncome }));

    component.incomeForm.setValue({
      description: 'Freelance',
      amount: 2000,
      category: 'Freelance',
      date: new Date('2025-10-22'),
      notes: ''
    });
    component.incomeForm.markAllAsTouched();
    component.incomeForm.updateValueAndValidity();
    fixture.detectChanges();

    component.submitForm();
    tick();

    expect(component.incomeForm.valid).toBeTrue();
    expect(incomeServiceSpy.addIncome).toHaveBeenCalledWith(component.incomeForm.value);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      '✔ Income saved successfully!',
      'Close',
      jasmine.any(Object)
    );
    expect(dialogRefSpy.close).toHaveBeenCalledWith(mockIncome);
  }));

  it('should show error snackbar when addIncome fails', fakeAsync(() => {
    incomeServiceSpy.addIncome.and.returnValue(throwError(() => new Error('Server Error')));

    component.incomeForm.setValue({
      description: 'Freelance',
      amount: 1500,
      category: 'Freelance',
      date: new Date('2025-10-22'),
      notes: ''
    });
    component.incomeForm.markAllAsTouched();
    component.incomeForm.updateValueAndValidity();
    fixture.detectChanges();

    component.submitForm();
    tick();

    expect(component.incomeForm.valid).toBeTrue();
    expect(incomeServiceSpy.addIncome).toHaveBeenCalled();
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      '✖ Failed to save income!',
      'Close',
      jasmine.any(Object)
    );
  }));
});
