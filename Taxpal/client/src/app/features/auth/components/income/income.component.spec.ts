import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncomeComponent } from './income.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe(' IncomeComponent UI Tests', () => {
  let component: IncomeComponent;
  let fixture: ComponentFixture<IncomeComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncomeComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(IncomeComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  //  Component Creation
  it('should create the IncomeComponent', () => {
    expect(component).toBeTruthy();
  });

  // UI Load Verification
  it('should display Add Income button on load', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const addButton = compiled.querySelector('button.add-income');
    expect(addButton).toBeTruthy();
  });

  //  Empty Form Validation
  it('should mark form invalid if fields are empty', () => {
    component.incomeForm.controls['category'].setValue('');
    component.incomeForm.controls['amount'].setValue('');
    component.incomeForm.controls['date'].setValue('');
    expect(component.incomeForm.invalid).toBeTrue();
  });

  // Negative Amount Validation
  it('should mark form invalid if amount is negative', () => {
    component.incomeForm.controls['category'].setValue('Salary');
    component.incomeForm.controls['amount'].setValue(-1000);
    component.incomeForm.controls['date'].setValue(new Date());
    expect(component.incomeForm.invalid).toBeTrue();
  });

  //  Valid Income Addition
  it('should add income when valid form is submitted', () => {
    component.incomeForm.setValue({
      category: 'Freelancing',
      amount: 5000,
      date: new Date()
    });

    expect(component.incomeForm.valid).toBeTrue();
    component.addIncome();

    expect(component.incomes.length).toBe(1);
    expect(component.incomes[0].category).toBe('Freelancing');
  });

  //  Edit Income Entry
  it('should edit an existing income entry', () => {
    component.incomes = [{ id: 1, category: 'Salary', amount: 4000, date: new Date() }];
    component.onEdit(1);
    component.incomeForm.controls['amount'].setValue(6000);
    component.saveEdit();
    expect(component.incomes[0].amount).toBe(6000);
  });

  // Delete Income Entry
  it('should delete an income record', () => {
    component.incomes = [
      { id: 1, category: 'Salary', amount: 4000, date: new Date() },
      { id: 2, category: 'Investment', amount: 2000, date: new Date() }
    ];
    component.onDelete(1);
    expect(component.incomes.length).toBe(1);
    expect(component.incomes[0].category).toBe('Investment');
  });

  // Total Income Calculation
  it('should calculate total income correctly', () => {
    component.incomes = [
      { id: 1, category: 'Salary', amount: 3000, date: new Date() },
      { id: 2, category: 'Bonus', amount: 2000, date: new Date() }
    ];

    const total = component.getTotalIncome();
    expect(total).toBe(5000);
  });

  // Search Income by Category
  it('should filter incomes by category', () => {
    component.incomes = [
      { id: 1, category: 'Salary', amount: 3000, date: new Date() },
      { id: 2, category: 'Freelance', amount: 2500, date: new Date() }
    ];

    const result = component.searchIncome('Salary');
    expect(result.length).toBe(1);
    expect(result[0].category).toBe('Salary');
  });

  // Date Validation (Future Date)
  it('should invalidate form if future date is selected', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);

    component.incomeForm.controls['category'].setValue('Salary');
    component.incomeForm.controls['amount'].setValue(3000);
    component.incomeForm.controls['date'].setValue(futureDate);

    const isValid = component.validateDate();
    expect(isValid).toBeFalse();
  });
});
