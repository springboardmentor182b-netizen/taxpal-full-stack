import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseComponent } from './expense.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe(' ExpenseComponent UI Tests', () => {
  let component: ExpenseComponent;
  let fixture: ComponentFixture<ExpenseComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpenseComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  //  Component Creation
  it('should create the ExpenseComponent', () => {
    expect(component).toBeTruthy();
  });

  // Page Load Verification
  it('should display expense list and Add button on load', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const addButton = compiled.querySelector('button.add-expense');
    expect(addButton).toBeTruthy();
  });

  //  Form Validation - Empty Fields
  it('should mark form invalid if fields are empty', () => {
    component.expenseForm.controls['category'].setValue('');
    component.expenseForm.controls['amount'].setValue('');
    component.expenseForm.controls['date'].setValue('');
    expect(component.expenseForm.invalid).toBeTrue();
  });

  //  Amount Validation
  it('should mark form invalid if amount is negative', () => {
    component.expenseForm.controls['category'].setValue('Food');
    component.expenseForm.controls['amount'].setValue(-500);
    component.expenseForm.controls['date'].setValue(new Date());
    expect(component.expenseForm.invalid).toBeTrue();
  });

  //  Add Expense
  it('should add a new expense when valid data entered', () => {
    component.expenseForm.setValue({
      category: 'Travel',
      amount: 1200,
      date: new Date()
    });
    expect(component.expenseForm.valid).toBeTrue();

    component.addExpense();
    expect(component.expenses.length).toBeGreaterThan(0);
    expect(component.expenses[0].category).toBe('Travel');
  });

  //  Edit Expense
  it('should edit an existing expense', () => {
    component.expenses = [{ id: 1, category: 'Food', amount: 100, date: new Date() }];
    component.onEdit(1);
    component.expenseForm.controls['amount'].setValue(300);
    component.saveEdit();
    expect(component.expenses[0].amount).toBe(300);
  });

  //  Delete Expense
  it('should delete an expense', () => {
    component.expenses = [
      { id: 1, category: 'Food', amount: 100, date: new Date() },
      { id: 2, category: 'Travel', amount: 200, date: new Date() }
    ];
    component.onDelete(1);
    expect(component.expenses.length).toBe(1);
    expect(component.expenses[0].category).toBe('Travel');
  });

  //  Calculate Total
  it('should calculate total expenses correctly', () => {
    component.expenses = [
      { id: 1, category: 'Food', amount: 1000, date: new Date() },
      { id: 2, category: 'Bills', amount: 2000, date: new Date() }
    ];
    const total = component.getTotalExpenses();
    expect(total).toBe(3000);
  });

  //  Expense Search Filter
  it('should filter expenses by category', () => {
    component.expenses = [
      { id: 1, category: 'Food', amount: 100, date: new Date() },
      { id: 2, category: 'Travel', amount: 200, date: new Date() }
    ];
    const result = component.searchExpense('Food');
    expect(result.length).toBe(1);
    expect(result[0].category).toBe('Food');
  });

  // Future Date Validation
  it('should invalidate if future date selected', () => {
    const future = new Date();
    future.setDate(future.getDate() + 5);
    component.expenseForm.controls['category'].setValue('Bills');
    component.expenseForm.controls['amount'].setValue(500);
    component.expenseForm.controls['date'].setValue(future);

    const isValid = component.validateDate();
    expect(isValid).toBeFalse();
  });
});
