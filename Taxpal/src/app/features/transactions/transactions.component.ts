import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TransactionService, Transaction, CreateTransactionRequest } from '../../core/services/transaction.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactions = signal<Transaction[]>([]);
  isLoading = signal(false);
  showAddForm = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  
  transactionForm: FormGroup;
  
  categories = [
    // Income categories
    { type: 'income', name: 'Salary', value: 'salary' },
    { type: 'income', name: 'Freelance', value: 'freelance' },
    { type: 'income', name: 'Business', value: 'business' },
    { type: 'income', name: 'Investment', value: 'investment' },
    { type: 'income', name: 'Other Income', value: 'other_income' },
    
    // Expense categories
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
    private transactionService: TransactionService
  ) {
    this.transactionForm = this.fb.group({
      type: ['expense', [Validators.required]],
      category: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      date: [new Date().toISOString().split('T')[0], [Validators.required]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.isLoading.set(true);
    this.transactionService.getTransactions({ limit: 50 }).subscribe({
      next: (response) => {
        this.transactions.set(response.transactions);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Failed to load transactions');
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
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
          this.errorMessage.set(error.error?.message || 'Failed to create transaction');
          this.isSubmitting.set(false);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  deleteTransaction(id: string): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(id).subscribe({
        next: () => {
          this.transactions.set(this.transactions().filter(t => t._id !== id));
        },
        error: (error) => {
          this.errorMessage.set('Failed to delete transaction');
        }
      });
    }
  }

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

  getTransactionTypeClass(type: string): string {
    return type === 'income' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  }

  getTransactionIcon(type: string): string {
    return type === 'income' ? 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' : 
           'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z';
  }

  formatCategory(category: string): string {
    return category.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  }

  private markFormGroupTouched(): void {
    Object.keys(this.transactionForm.controls).forEach(key => {
      const control = this.transactionForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string | null {
    const field = this.transactionForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['min']) {
        return 'Amount must be greater than 0';
      }
    }
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.transactionForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }
}
