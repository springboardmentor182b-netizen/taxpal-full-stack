import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { BudgetComponent } from './budget.component';
import { BudgetService, BudgetDto } from '../../services/budget.service';

describe('BudgetComponent', () => {
  let component: BudgetComponent;
  let fixture: ComponentFixture<BudgetComponent>;
  let budgetServiceSpy: jasmine.SpyObj<BudgetService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create spies (mocks) for BudgetService and Router
    budgetServiceSpy = jasmine.createSpyObj('BudgetService', ['createBudget', 'getBudgets']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Configure testing module for BudgetComponent
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BudgetComponent], // include standalone component
      providers: [
        { provide: BudgetService, useValue: budgetServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    // Create component and test fixture
    fixture = TestBed.createComponent(BudgetComponent);
    component = fixture.componentInstance;

    // Default: return empty list from getBudgets()
    budgetServiceSpy.getBudgets.and.returnValue(of([]));

    fixture.detectChanges(); // triggers ngOnInit and form setup
  });

  // ------------------------
  // TC_026: Create Budget (Valid)
  // ------------------------
  it('TC_026: should create budget successfully when form is valid', fakeAsync(() => {
    // Mock response from API
    const mockBudget: BudgetDto = {
      id: '1',
      category: 'food',
      limit: 1000,
      month: '2025-09',
      description: 'groceries',
      user_id: '123'
    };

    // Fill the form with valid values
    component.form.setValue({
      category: 'food',
      amount: 1000,
      month: '2025-09-29',
      description: 'groceries'
    });

    // Mock createBudget API call to return success
    budgetServiceSpy.createBudget.and.returnValue(of(mockBudget));

    // Trigger submit
    component.onSubmit();
    tick(); // simulate async observable resolution

    // Expectations
    expect(budgetServiceSpy.createBudget).toHaveBeenCalledWith(jasmine.objectContaining({
      category: 'food',
      limit: 1000,
      month: '2025-09' // should be trimmed to YYYY-MM
    }));
    expect(component.budgets.length).toBe(1); // budget added to list
    expect(component.budgets[0]).toEqual(mockBudget);
  }));

  // ------------------------
  // TC_027: Create Budget (Missing Fields)
  // ------------------------
  it('TC_027: should show error when required fields are missing', () => {
    // Fill form with empty values
    component.form.setValue({
      category: '',
      amount: null,
      month: '',
      description: ''
    });

    // Trigger submit
    component.onSubmit();

    // Expectations
    expect(component.form.invalid).toBeTrue(); // form should be invalid
    expect(budgetServiceSpy.createBudget).not.toHaveBeenCalled(); // API not called
  });

  // ------------------------
  // TC_028: Create Budget (Invalid Amount)
  // ------------------------
  it('TC_028: should not allow invalid/negative amount', () => {
    // Fill form with negative amount
    component.form.setValue({
      category: 'utilities',
      amount: -500,
      month: '2025-09-29',
      description: 'invalid test'
    });

    // Trigger submit
    component.onSubmit();

    // Expectations
    expect(component.form.invalid).toBeTrue(); // form invalid due to amount < 0
    expect(component.form.controls['amount'].hasError('min')).toBeTrue(); // min validator triggered
    expect(budgetServiceSpy.createBudget).not.toHaveBeenCalled(); // API not called
  });

  // ------------------------
  // TC_029: Cancel Budget Form
  // ------------------------
  it('TC_029: should reset form when cancel is clicked', () => {
    // Fill form with some values
    component.form.setValue({
      category: 'entertainment',
      amount: 2000,
      month: '2025-09-29',
      description: 'movies'
    });

    // Simulate cancel action by resetting form
    component.form.reset();

    // Expectations: form should be cleared
    expect(component.form.value.category).toBeNull();
    expect(component.form.value.amount).toBeNull();
    expect(component.form.value.description).toBeNull();
  });
});