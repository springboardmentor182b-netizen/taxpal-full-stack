import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BudgetFormComponent, Budget } from './budget-form.component';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService, User } from '../../../features/auth.service';
import { Router } from '@angular/router'; // Import Router for testing

// Mock AuthService
class MockAuthService {
  getCurrentUser(): User {
    return {
      id: 'user-1',
      fullName: 'Test User',
      email: 'test@example.com',
      username: 'testuser'
    };
  }

  logout() {
    return of(null);
  }
}

// Mock HttpClient
class MockHttpClient {
  // Mock 'get' to return an empty list initially
  get() {
    return of([]);
  }

  // Mock 'post' to simulate API response for a new budget
  post(url: string, body: any) {
    // The API might incorrectly return remaining = amount, 
    // but the component should correct it based on the spent amount in the body.
    const postedBudget: Budget = {
      category: body.category,
      amount: body.amount,
      spent: body.spent,
      // Simulate INCORRECT API behavior (where remaining is not calculated)
      remaining: body.amount, 
      status: 'Good',
      month: body.month,
      description: body.description
    };
    return of(postedBudget);
  }
}

describe('BudgetFormComponent', () => {
  let component: BudgetFormComponent;
  let fixture: ComponentFixture<BudgetFormComponent>;
  let mockRouter: any;

  beforeEach(async () => {
    mockRouter = { navigate: jasmine.createSpy('navigate') };

    await TestBed.configureTestingModule({
      imports: [FormsModule, BudgetFormComponent],
      providers: [
        { provide: HttpClient, useClass: MockHttpClient },
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useValue: mockRouter } // Provide the mock router
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and initialize user', () => {
    expect(component).toBeTruthy();
    expect(component.currentUser.fullName).toBe('Test User');
    expect(component.userInitials).toBe('TU');
  });

  it('should calculate remaining and status correctly on addBudget (Non-Zero Spent)', () => {
    const initialLength = component.budgets().length;
    
    // Set up a budget where spent > 0
    const budgetAmount = 1000;
    const spentAmount = 300;
    const expectedRemaining = budgetAmount - spentAmount; // 700

    component.newBudget.set({
      category: 'Testing Expense',
      amount: budgetAmount,
      spent: spentAmount,
      month: '2025-06',
      description: 'Budget with partial spend'
    });

    component.addBudget();

    const updatedBudgets = component.budgets();
    expect(updatedBudgets.length).toBe(initialLength + 1);

    const newBudget = updatedBudgets[updatedBudgets.length - 1];

    // CRITICAL ASSERTION: Checks if the component's client-side logic corrected the amount
    expect(newBudget.remaining).toBe(expectedRemaining); 
    
    // Check status logic (700 is 70% of 1000, which is >= 50%)
    expect(newBudget.status).toBe('Good'); 

    // Check form reset
    const formState = component.newBudget();
    expect(formState.category).toBeNull();
    expect(formState.amount).toBeNull();
    expect(formState.spent).toBe(0); 
    expect(component.isFormVisible()).toBeFalse();
  });

  it('should calculate remaining and status correctly on addBudget (Zero Spent)', () => {
    const initialLength = component.budgets().length;
    
    component.newBudget.set({
      category: 'Testing Income',
      amount: 500,
      spent: 0,
      month: '2025-07',
      description: 'Zero spend'
    });

    component.addBudget();

    const updatedBudgets = component.budgets();
    const newBudget = updatedBudgets[updatedBudgets.length - 1];

    // Check remaining when spent is 0
    expect(newBudget.remaining).toBe(500); 
    
    // Check status logic (500 is 100% of 500)
    expect(newBudget.status).toBe('Good'); 
  });

  it('should not add budget if required fields are missing', () => {
    const initialLength = component.budgets().length;

    component.newBudget.set({
      category: null,
      amount: null,
      spent: 0,
      month: null,
      description: null
    });

    component.addBudget();

    expect(component.budgets().length).toBe(initialLength);
  });
});
