import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BudgetFormComponent } from './budget-form.component';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService, User } from '../../../features/auth.service';

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
  get() {
    return of([]); // Return empty list of budgets
  }

  post() {
    return of({
      category: 'Testing',
      amount: 1000,
      spent: 0,
      remaining: 1000,
      status: 'Good',
      month: '2025-06',
      description: 'Test budget'
    });
  }
}

describe('BudgetFormComponent', () => {
  let component: BudgetFormComponent;
  let fixture: ComponentFixture<BudgetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, BudgetFormComponent],
      providers: [
        { provide: HttpClient, useClass: MockHttpClient },
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle form visibility', () => {
    expect(component.isFormVisible()).toBeFalse();
    component.isFormVisible.set(true);
    expect(component.isFormVisible()).toBeTrue();
    component.isFormVisible.set(false);
    expect(component.isFormVisible()).toBeFalse();
  });

  it('should add a new budget correctly', () => {
    const initialLength = component.budgets().length;

    component.newBudget.set({
      category: 'Testing',
      amount: 1000,
      spent: 0,
      month: '2025-06',
      description: 'Test budget'
    });

    component.addBudget();

    const updatedBudgets = component.budgets();
    expect(updatedBudgets.length).toBe(initialLength + 1);

    const newBudget = updatedBudgets[updatedBudgets.length - 1];
    expect(newBudget.category).toBe('Testing');
    expect(newBudget.amount).toBe(1000);
    expect(newBudget.spent).toBe(0);
    expect(newBudget.remaining).toBe(1000);
    expect(newBudget.status).toBe('Good');
    expect(newBudget.month).toBe('2025-06');

    const formState = component.newBudget();
    expect(formState.category).toBeNull();
    expect(formState.amount).toBeNull();
    expect(formState.spent).toBe(0); // ✅ Reset to 0
    expect(formState.month).toBeNull();
    expect(formState.description).toBeNull();

    expect(component.isFormVisible()).toBeFalse();
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
