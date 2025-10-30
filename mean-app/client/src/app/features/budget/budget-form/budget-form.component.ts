import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService, User } from '../../../features/auth.service';
import { environment } from '../../../../environments/environment';

export interface Budget {
  _id?: string; // <-- added for delete
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
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './budget-form.component.html',
  styleUrls: ['./budget-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetFormComponent {
  private readonly API_BASE_URL = `${environment.apiUrl}/budgets`;

  public isFormVisible = signal(false);
  public budgets = signal<Budget[]>([]);
  public formSubmitted = signal(false);

  public newBudget = signal({
    category: null as string | null,
    amount: null as number | null,
    month: null as string | null,
    description: null as string | null,
    spent: 0 as number | null
  });

  sidebarActive = false;
  collapsed = false;

  userInitials = '';
  currentUser: User = {
    id: '',
    fullName: '',
    email: '',
    username: ''
  };

  selectedBudget: Budget | null = null;
  popupPosition = { top: 0, left: 0 };

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUser = user;
      this.setUserInitials(user.fullName);
      this.fetchBudgets();
    } else {
      console.warn('No user logged in.');
      this.router.navigate(['/login']);
    }
  }

  private setUserInitials(fullName: string | null | undefined) {
    if (!fullName) {
      this.userInitials = '';
      return;
    }
    const names = fullName.trim().split(' ');
    this.userInitials = names.length === 1
      ? names[0].charAt(0).toUpperCase()
      : names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  }

  fetchBudgets() {
    if (!this.currentUser?.id) return;
    this.http.get<Budget[]>(`${this.API_BASE_URL}/${this.currentUser.id}`).subscribe({
      next: (realBudgets) => this.budgets.set(realBudgets),
      error: (err) => {
        console.error('Error fetching budgets:', err);
        this.budgets.set([]);
      }
    });
  }

  addBudget(): void {
    this.formSubmitted.set(true);
    const budgetData = this.newBudget();

    if (!budgetData.category?.trim() || !budgetData.month?.trim()) return;
    if (budgetData.amount == null || isNaN(budgetData.amount) || budgetData.amount <= 0) return;

    const remaining = (budgetData.amount ?? 0) - (budgetData.spent ?? 0);

    const status = remaining >= (budgetData.amount ?? 0) * 0.5
      ? 'Good'
      : remaining >= (budgetData.amount ?? 0) * 0.25
      ? 'Fair'
      : 'Poor';

    const payload: Budget = {
      category: budgetData.category,
      amount: budgetData.amount ?? 0,
      spent: budgetData.spent ?? 0,
      remaining,
      status,
      month: budgetData.month,
      description: budgetData.description ?? ''
    };

    const apiPayload = { ...payload, userId: this.currentUser.id };

    this.http.post<Budget>(this.API_BASE_URL, apiPayload).subscribe({
      next: (savedBudget) => {
        this.budgets.update(budgets => [...budgets, savedBudget]);
        this.resetForm();
        this.isFormVisible.set(false);
      },
      error: (err) => console.error('Error creating budget:', err)
    });
  }

  resetForm(): void {
    this.newBudget.set({
      category: null,
      amount: null,
      month: null,
      description: null,
      spent: 0
    });
    this.formSubmitted.set(false);
  }

  trackByCategory(index: number, budget: Budget) {
    return budget._id ?? budget.category;
  }

  viewBudgetDetails(budget: Budget, event: MouseEvent) {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    this.popupPosition = {
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX
    };
    this.selectedBudget = budget;
  }

  closePopup() {
    this.selectedBudget = null;
  }

  updateNewBudgetCategory(value: string | null) {
    this.newBudget.update(b => ({ ...b, category: value }));
  }

  updateNewBudgetAmount(value: number | null) {
    this.newBudget.update(b => ({ ...b, amount: value }));
  }

  updateNewBudgetMonth(value: string | null) {
    this.newBudget.update(b => ({ ...b, month: value }));
  }

  updateNewBudgetDescription(value: string | null) {
    this.newBudget.update(b => ({ ...b, description: value }));
  }

  updateNewBudgetSpent(value: number | null) {
    this.newBudget.update(b => ({ ...b, spent: value ?? 0 }));
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        console.error('Logout error:', err);
        this.router.navigate(['/login']);
      }
    });
  }

  closeSidebarOverlay() {
    this.sidebarActive = false;
  }

  deleteBudget(budget: Budget & { _id?: string }) {
    if (!budget._id) return;
    if (!confirm(`Are you sure you want to delete the budget for ${budget.category}?`)) return;

    this.http.delete(`${this.API_BASE_URL}/${budget._id}`).subscribe({
      next: () => {
        this.budgets.update(budgets => budgets.filter(b => (b as any)._id !== budget._id));
        if (this.selectedBudget?._id === budget._id) this.closePopup();
        alert('Budget deleted successfully');
      },
      error: (err) => {
        console.error('Failed to delete budget:', err);
        alert('Could not delete budget. Please try again.');
      }
    });
  }
}
