import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../core/services/auth.service';

// NEW imports:
import { IncomeModalComponent } from '../auth/components/income/income.model';
import { ExpenseModalComponent } from '../auth/components/expense/expense.model';
import { TransactionService } from '../../core/services/transaction.service';

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
    private tx: TransactionService         // inject service
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

  // called when Income modal emits (save)
  onIncomeSave(formData: any) {
    // match your Income interface
    const payload = {
      description: formData.description,
      amount: +formData.amount,
      category: formData.category,
      date: formData.date,
      notes: formData.notes
    };
    this.tx.createIncome(payload).subscribe({
      next: () => { this.incomeOpen.set(false); /* TODO: refresh stats, toast */ },
      error: () => { /* TODO: toast error */ }
    });
  }

  // called when Expense modal emits (save)
  onExpenseSave(formData: any) {
    const payload = {
      description: formData.description,
      amount: +formData.amount,
      category: formData.category,
      date: formData.date,
      notes: formData.notes
    };
    this.tx.createExpense(payload).subscribe({
      next: () => { this.expenseOpen.set(false); /* TODO: refresh stats, toast */ },
      error: () => { /* TODO: toast error */ }
    });
  }
}
