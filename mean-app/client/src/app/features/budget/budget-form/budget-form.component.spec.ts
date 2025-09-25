import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BudgetFormComponent, Budget } from './budget-form.component';

describe('BudgetFormComponent', () => {
  let component: BudgetFormComponent;
  let fixture: ComponentFixture<BudgetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, BudgetFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize budgets with mock data', () => {
    const budgets = component.budgets();
    expect(budgets.length).toBe(3);
    expect(budgets[0].category).toBe('Design Project');
  });

  it('should toggle form visibility', () => {
    expect(component.isFormVisible()).toBeFalse();
    component.isFormVisible.set(true);
    expect(component.isFormVisible()).toBeTrue();
    component.isFormVisible.set(false);
    expect(component.isFormVisible()).toBeFalse();
  });

  it('should add a new budget correctly', () => {
    // Set new budget values
    component.newBudget.set({
      category: 'Testing',
      amount: 1000,
      month: 'June, 2025',
      description: 'Test budget'
    });

    const initialLength = component.budgets().length;

    component.addBudget();

    const updatedBudgets = component.budgets();
    expect(updatedBudgets.length).toBe(initialLength + 1);

    const newBudget = updatedBudgets[updatedBudgets.length - 1];
    expect(newBudget.category).toBe('Testing');
    expect(newBudget.amount).toBe(1000);
    expect(newBudget.remaining).toBe(1000);
    expect(newBudget.status).toBe('Good');

    // Form should be reset
    const formState = component.newBudget();
    expect(formState.category).toBeNull();
    expect(formState.amount).toBeNull();
    expect(formState.month).toBeNull();
    expect(formState.description).toBeNull();

    // Form visibility should be false
    expect(component.isFormVisible()).toBeFalse();
  });

  it('should not add budget if required fields are missing', () => {
    const initialLength = component.budgets().length;

    component.newBudget.set({
      category: null,
      amount: null,
      month: null,
      description: null
    });

    component.addBudget();

    expect(component.budgets().length).toBe(initialLength);
  });
});