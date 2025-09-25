import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
export interface Budget {
  category: string;
  amount: number;
  spent: number;
  remaining: number;
  status: 'Good' | 'Fair' | 'Poor';
  month: string;
  description?: string;
}

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './budget-form.component.html',
  styleUrls: ['./budget-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetFormComponent {
  // --- Budget Form State ---
  public isFormVisible = signal(false);
  public budgets = signal<Budget[]>([]);
  public newBudget = signal({
    category: null as string | null,
    amount: null as number | null,
    month: null as string | null,
    description: null as string | null,
  });

  // --- Sidebar / Profile State ---
  sidebarActive = false;
  collapsed = false;
  userInitials = 'JD';
  currentUser = { fullName: 'John Doe', email: 'john@example.com' };

  constructor() {
    this.fetchBudgets();
  }

  // --- Budget Methods ---
  fetchBudgets() {
    const mockBudgets: Budget[] = [
      { category: 'Design Project', amount: 1250, spent: 230, remaining: 1020, status: 'Good', month: 'May, 2025' },
      { category: 'Consulting', amount: 1500, spent: 1200, remaining: 300, status: 'Fair', month: 'May, 2025' },
      { category: 'Marketing', amount: 500, spent: 500, remaining: 0, status: 'Poor', month: 'May, 2025' },
    ];
    this.budgets.set(mockBudgets);
  }

  addBudget(): void {
    const budgetData = this.newBudget();
    if (budgetData.category && budgetData.amount && budgetData.month) {
      const newEntry: Budget = {
        category: budgetData.category,
        amount: budgetData.amount,
        spent: 0,
        remaining: budgetData.amount,
        status: 'Good',
        month: budgetData.month,
        description: budgetData.description ?? '',
      };
      this.budgets.update(budgets => [...budgets, newEntry]);
      this.resetForm();
      this.isFormVisible.set(false);
    } else {
      console.error('Please fill in all required fields.');
    }
  }

  resetForm(): void {
    this.newBudget.set({ category: null, amount: null, month: null, description: null });
  }

  trackByCategory(index: number, budget: Budget) {
    return budget.category;
  }

  // --- Budget Field Updates ---
  updateNewBudgetCategory(value: string | null) {
    const current = this.newBudget();
    this.newBudget.set({ ...current, category: value });
  }

  updateNewBudgetAmount(value: number | null) {
    const current = this.newBudget();
    this.newBudget.set({ ...current, amount: value });
  }

  updateNewBudgetMonth(value: string | null) {
    const current = this.newBudget();
    this.newBudget.set({ ...current, month: value });
  }

  updateNewBudgetDescription(value: string | null) {
    const current = this.newBudget();
    this.newBudget.set({ ...current, description: value });
  }

  // --- Sidebar Methods ---
  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  logout() {
    console.log('User logged out');
  }

  closeSidebarOverlay() {
    this.sidebarActive = false;
  }
}