import { Component, OnInit, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TransactionService, Transaction, CreateTransactionRequest } from '../../../core/services/transaction.service';
import { AuthService, User } from '../../../core/services/auth.service';
import { BudgetsListComponent } from '../../budgets/component/budgets-list.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive, BudgetsListComponent],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  /** ====== Auth / user (for sidebar avatar) ====== */
  user: User | null = null;

  /** ====== Drawer state (same as Dashboard) ====== */
  mobileNavOpen = false;

  /** ====== Existing state/signals ====== */
  transactions = signal<Transaction[]>([]);
  isLoading = signal(false);
  showAddForm = signal(false); // kept (form still present, no top-bar trigger)
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  isDeletingAll = signal(false);
  private deletingIds = signal<Set<string>>(new Set());

  /** ====== Budget modal state (now functional) ====== */
  showBudget = false;

  /** ====== Form ====== */
  public transactionForm: FormGroup;

  /** ====== Categories ====== */
  public categories = [
    // Income
    { type: 'income', name: 'Salary', value: 'salary' },
    { type: 'income', name: 'Freelance', value: 'freelance' },
    { type: 'income', name: 'Business', value: 'business' },
    { type: 'income', name: 'Investment', value: 'investment' },
    { type: 'income', name: 'Other Income', value: 'other_income' },
    // Expense
    { type: 'expense', name: 'Food & Dining', value: 'food_dining' },
    { type: 'expense', name: 'Transportation', value: 'transportation' },
    { type: 'expense', name: 'Housing', value: 'housing' },
    { type: 'expense', name: 'Utilities', value: 'utilities' },
    { type: 'expense', name: 'Healthcare', value: 'healthcare' },
    { type: 'expense', name: 'Entertainment', value: 'entertainment' },
    { type: 'expense', name: 'Shopping', value: 'shopping' },
    { type: 'expense', name: 'Education', value: 'education' },
    { type: 'expense', name: 'Business Expenses', value: 'business_expenses' },
    { type: 'expense', name: 'Other Expenses', value: 'other_expenses' }
  ];

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    public auth: AuthService
  ) {
    this.transactionForm = this.fb.group({
      type: ['expense', [Validators.required]],
      category: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      date: [new Date().toISOString().split('T')[0], [Validators.required]],
      description: ['']
    });

    this.auth.currentUser$.subscribe(u => { this.user = u; });
    this.user = this.auth.getCurrentUser();
  }

  ngOnInit(): void { this.loadTransactions(); }

  /** ================= Drawer helpers (same as Dashboard) ================= */
  toggleMobileNav(): void {
    this.mobileNavOpen = !this.mobileNavOpen;
    this.lockScroll(this.mobileNavOpen);
  }
  closeMobileNav(): void {
    this.mobileNavOpen = false;
    this.lockScroll(false);
  }
  closeMobileNavIfSmall(): void {
    if (window.innerWidth <= 1024) this.closeMobileNav();
  }
  private lockScroll(lock: boolean) {
    try { document.body.style.overflow = lock ? 'hidden' : ''; } catch {}
  }
  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && this.mobileNavOpen) this.closeMobileNav();
    if (e.key === 'Escape' && this.showBudget) this.closeBudget();
  }
  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 1024 && this.mobileNavOpen) this.closeMobileNav();
  }

  /** Avatar initials */
  get firstInitial(): string {
    const s = (this.user?.name || this.user?.email || 'U').trim();
    return s ? s[0].toUpperCase() : 'U';
  }
  get secondInitial(): string {
    const n = this.user?.name?.trim();
    if (!n) return '';
    const parts = n.split(/\s+/);
    return (parts[1]?.[0] ?? '').toUpperCase();
  }

  /** ============== Data ============== */
  loadTransactions(): void {
    this.isLoading.set(true);
    this.transactionService.getTransactions({ limit: 50 }).subscribe({
      next: (response) => {
        this.transactions.set(response.transactions);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load transactions');
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (!this.transactionForm.valid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const formData = this.transactionForm.value;
    const transactionData: CreateTransactionRequest = {
      type: formData.type,
      category: formData.category,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date),
      description: formData.description || undefined
    };

    this.transactionService.createTransaction(transactionData).subscribe({
      next: (response) => {
        this.transactions.set([response.transaction, ...this.transactions()]);
        this.isSubmitting.set(false);
        this.showAddForm.set(false);
        this.transactionForm.reset({
          type: 'expense',
          date: new Date().toISOString().split('T')[0]
        });
      },
      error: (error) => {
        this.errorMessage.set(error?.error?.message || 'Failed to create transaction');
        this.isSubmitting.set(false);
      }
    });
  }

  /** ========== Delete one (optimistic) ========== */
  deleteTransaction(id: string): void {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    const prev = this.transactions();
    this.transactions.set(prev.filter(t => t._id !== id));
    this.addDeleting(id);

    this.transactionService.deleteTransaction(id).subscribe({
      next: () => this.removeDeleting(id),
      error: () => {
        this.transactions.set(prev);
        this.removeDeleting(id);
        this.errorMessage.set('Failed to delete transaction');
      }
    });
  }
  public isDeleting = (id: string): boolean => this.deletingIds().has(id);
  private addDeleting(id: string) { const s = new Set(this.deletingIds()); s.add(id); this.deletingIds.set(s); }
  private removeDeleting(id: string) { const s = new Set(this.deletingIds()); s.delete(id); this.deletingIds.set(s); }

  /** ========== Delete ALL ========== */
  deleteAllTransactions(): void {
    if (!this.transactions().length) return;
    if (!confirm('Delete ALL your transactions? This cannot be undone.')) return;

    this.isDeletingAll.set(true);
    this.transactionService.deleteAll().subscribe({
      next: (res) => {
        if (res.deletedCount > 0) {
          this.transactions.set([]);
        } else {
          this.errorMessage.set('No transactions were deleted.');
        }
        this.isDeletingAll.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to delete all transactions');
        this.isDeletingAll.set(false);
      }
    });
  }

  /** ===== Budgets (now functional like Dashboard) ===== */
  openBudget(): void { this.showBudget = true; this.lockScroll(true); }
  closeBudget(): void { this.showBudget = false; this.lockScroll(false); }

  /** ===== (Form helpers kept) ===== */
  toggleAddForm(): void {
    this.showAddForm.set(!this.showAddForm());
    if (!this.showAddForm()) {
      this.transactionForm.reset({
        type: 'expense',
        date: new Date().toISOString().split('T')[0]
      });
      this.errorMessage.set(null);
    }
  }

  getFilteredCategories(): Array<{type: string, name: string, value: string}> {
    const selectedType = this.transactionForm.get('type')?.value;
    return this.categories.filter(cat => cat.type === selectedType);
  }

  onTypeChange(): void {
    this.transactionForm.get('category')?.setValue('');
  }

  /** ===== Template helpers (arrow functions so template type-check sees them) ===== */
  public getTransactionTypeClass = (type: string): string =>
    type === 'income' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';

  public getTransactionIcon = (type: string): string =>
    type === 'income'
      ? 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
      : 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 004 0z';

  public formatCategory = (category: string): string =>
    category.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

  public trackById = (_index: number, item: Transaction) => item._id;

  public getFieldError = (fieldName: string): string | null => {
    const field = this.transactionForm.get(fieldName);
    if (field?.errors && (field.touched || field.dirty)) {
      if (field.errors['required']) return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      if (field.errors['min']) return 'Amount must be greater than 0';
      if (field.errors['minlength']) return `Minimum length is ${field.errors['minlength'].requiredLength}`;
      if (field.errors['maxlength']) return `Maximum length is ${field.errors['maxlength'].requiredLength}`;
    }
    return null;
  };

  public isFieldInvalid = (fieldName: string): boolean => {
    const field = this.transactionForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  };

  private markFormGroupTouched(): void {
    Object.keys(this.transactionForm.controls).forEach(key => {
      const control = this.transactionForm.get(key);
      control?.markAsTouched();
    });
  }
}
