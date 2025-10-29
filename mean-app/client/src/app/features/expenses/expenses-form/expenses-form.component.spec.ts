import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ExpensesForm } from './expenses-form.component';
import { ExpenseService } from '../../../services/expense.service';
import { MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ExpensesForm', () => {
  let component: ExpensesForm;
  let fixture: ComponentFixture<ExpensesForm>;
  let expenseServiceSpy: jasmine.SpyObj<ExpenseService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ExpensesForm>>;

  beforeEach(async () => {
   
    expenseServiceSpy = jasmine.createSpyObj('ExpenseService', ['addExpense']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ExpensesForm, ReactiveFormsModule, HttpClientTestingModule], 
      providers: [
        { provide: ExpenseService, useValue: expenseServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpensesForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form as invalid when required fields are empty', () => {
    component.expensesForm.setValue({
      description: '',
      amount: null,
      category: '',
      date: null,
      notes: ''
    });
    component.expensesForm.markAllAsTouched();
    component.expensesForm.updateValueAndValidity();
    fixture.detectChanges();

    expect(component.expensesForm.invalid).toBeTrue();
  });

  it('should call addExpense and close dialog on valid form submit', fakeAsync(() => {
    const mockExpense = {
      id: 1,
      description: 'Office Supplies',
      amount: 500,
      category: 'Business',
      date: new Date('2025-10-22'),
      notes: ''
    };

    expenseServiceSpy.addExpense.and.returnValue(of({ expense: mockExpense }));

    component.expensesForm.setValue({
      description: 'Office Supplies',
      amount: 500,
      category: 'Business',
      date: new Date('2025-10-22'),
      notes: ''
    });

    component.submitForm();
    tick();

    expect(component.expensesForm.valid).toBeTrue();
    expect(expenseServiceSpy.addExpense).toHaveBeenCalledWith(component.expensesForm.value);
    expect(dialogRefSpy.close).toHaveBeenCalledWith(mockExpense);
  }));

  it('should handle error when addExpense fails', fakeAsync(() => {
    expenseServiceSpy.addExpense.and.returnValue(throwError(() => new Error('Server Error')));

    component.expensesForm.setValue({
      description: 'Office Supplies',
      amount: 500,
      category: 'Business',
      date: new Date('2025-10-22'),
      notes: ''
    });

    component.submitForm();
    tick();

    expect(expenseServiceSpy.addExpense).toHaveBeenCalled();
    expect(dialogRefSpy.close).not.toHaveBeenCalled(); 
  }));

  it('should reset form and close dialog on cancel', () => {
    component.expensesForm.setValue({
      description: 'Test',
      amount: 100,
      category: 'Other',
      date: new Date(),
      notes: 'Test notes'
    });

    component.cancelForm();

    const formValue = component.expensesForm.value;

    expect(formValue.description).toBeNull();
    expect(formValue.amount).toBeNull();
    expect(formValue.category).toBeNull();
    expect(formValue.date).toBeNull();
     expect(formValue.notes).toBeNull(); 
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});