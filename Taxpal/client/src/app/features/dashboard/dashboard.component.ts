import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../core/services/auth.service';

// COMPONENTS (standalone)
import { IncomeModalComponent } from '../auth/components/income/income';
import { ExpenseModalComponent } from '../auth/components/expense/expense';

// SERVICE
import { TransactionService } from '../auth/services/transaction.service';

// TYPES (interfaces)
import type { Income } from '../auth/models/income.model';
import type { Expense } from '../auth/models/expense.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, IncomeModalComponent, ExpenseModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user = signal<User | null>(null);
  isLoading = signal(true);

  // modal flags (signals)
  incomeOpen = signal(false);
  expenseOpen = signal(false);

  constructor(
    private authService: AuthService,
    private tx: TransactionService
  ) {}

  ngOnInit(): void {
    this.user.set(this.authService.getCurrentUser());
    this.isLoading.set(false);
  }

  logout(): void {
    this.authService.logout();
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  // Income save handler
  onIncomeSave(formData: any) {
    const payload: Income = {
      description: formData.description,
      amount: +formData.amount,
      category: formData.category,
      date: formData.date,
      notes: formData.notes
    };
    this.tx.createIncome(payload).subscribe({
      next: () => this.incomeOpen.set(false),
      error: () => { /* TODO: show error toast */ }
    });
  }

  // Expense save handler
  onExpenseSave(formData: any) {
    const payload: Expense = {
      description: formData.description,
      amount: +formData.amount,
      category: formData.category,
      date: formData.date,
      notes: formData.notes
    };
    this.tx.createExpense(payload).subscribe({
      next: () => this.expenseOpen.set(false),
      error: () => { /* TODO: show error toast */ }
    });
  }
}
