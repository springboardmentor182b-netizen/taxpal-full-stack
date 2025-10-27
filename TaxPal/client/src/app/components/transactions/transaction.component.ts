import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

interface Transaction {
  _id?: string;
  title: string;
  amount?: number | null;
  category?: string;
  date?: string | Date;
  notes?: string;
  taxDeductible?: string | null;
  type: 'income' | 'expense';
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit, OnDestroy {
  recentTransactions: Transaction[] = [];
  loading = false;
  error = '';

  // modal states
  isAddIncomeModalVisible = false;
  isAddExpenseModalVisible = false;
  incomeLoading = false;
  expenseLoading = false;

  // forms
  incomeForm: Partial<Transaction> = { title: '', amount: null, category: '', date: '', notes: '', type: 'income' };
  expenseForm: Partial<Transaction> = { title: '', amount: null, category: '', date: '', notes: '', taxDeductible: '', type: 'expense' };

  // Added: lists and messages (used by the user-profile form markup you copied)
  incomeList: any[] = [];
  expenseList: any[] = [];
  incomeErrorMsg = '';
  expenseErrorMsg = '';
  incomeSuccessMsg = '';
  expenseSuccessMsg = '';

  userEmail = localStorage.getItem('user_email') || '';

  // ensure we can clean up/restore body overflow
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // clear any stray overflow lock (in case previous modal left it)
    try { document.body.style.overflow = ''; } catch (e) {}
    // Ensure both lists + combined recent transactions are loaded
    this.fetchTransactions();
  }

  ngOnDestroy(): void {
    // restore scrolling when leaving the page
    try { document.body.style.overflow = ''; } catch (e) {}
  }

  fetchTransactions(): void {
    this.loading = true;
    this.error = '';

    const emailQuery = this.userEmail ? `?userEmail=${encodeURIComponent(this.userEmail)}` : '';

    Promise.all([
      this.http.get<any[]>(`/api/users/income-list${emailQuery}`).toPromise(),
      this.http.get<any[]>(`/api/users/expense-list${emailQuery}`).toPromise()
    ]).then(([incomes = [], expenses = []]) => {
      // Populate incomeList & expenseList for the tables
      this.incomeList = (incomes || []).map(i => ({ ...i, date: i.date ? new Date(i.date) : null }));
      this.expenseList = (expenses || []).map(e => ({ ...e, date: e.date ? new Date(e.date) : null }));

      // Build combined recentTransactions sorted by date
      const mappedIncomes: Transaction[] = this.incomeList.map(i => ({ ...i, type: 'income' }));
      const mappedExpenses: Transaction[] = this.expenseList.map(e => ({ ...e, type: 'expense' }));
      const combined = [...mappedIncomes, ...mappedExpenses];
      combined.sort((a, b) => {
        const da = a.date ? new Date(a.date).getTime() : 0;
        const db = b.date ? new Date(b.date).getTime() : 0;
        return db - da;
      });
      this.recentTransactions = combined;
      this.loading = false;
    }).catch(err => {
      console.error(err);
      this.error = 'Failed to load transactions.';
      this.loading = false;
      this.incomeList = [];
      this.expenseList = [];
      this.recentTransactions = [];
    });
  }

  // open/close modals
  showAddIncomeModal(event?: Event): void {
    if (event) event.stopPropagation();
    this.resetIncomeForm();
    this.isAddIncomeModalVisible = true;
    try { document.body.style.overflow = 'hidden'; } catch (e) {}
    this.cdr.detectChanges();
  }

  hideAddIncomeModal(event?: Event): void {
    // if called from overlay click, ensure we only close when clicking backdrop
    if (event) {
      const target = (event as Event).target as HTMLElement;
      if (!target || !target.classList.contains('modal-overlay')) {
        return;
      }
    }
    this.isAddIncomeModalVisible = false;
    try { document.body.style.overflow = ''; } catch (e) {}
    this.cdr.detectChanges();
  }

  showAddExpenseModal(event?: Event): void {
    if (event) event.stopPropagation();
    this.resetExpenseForm();
    this.isAddExpenseModalVisible = true;
    try { document.body.style.overflow = 'hidden'; } catch (e) {}
    this.cdr.detectChanges();
  }

  hideAddExpenseModal(event?: Event): void {
    if (event) {
      const target = (event as Event).target as HTMLElement;
      if (!target || !target.classList.contains('modal-overlay')) {
        return;
      }
    }
    this.isAddExpenseModalVisible = false;
    try { document.body.style.overflow = ''; } catch (e) {}
    this.cdr.detectChanges();
  }

  // Add methods identical (behavior-wise) to user-profile component so template bindings work
  submitIncome(): void {
    // Basic validation
    if (!this.incomeForm.title || !this.incomeForm.amount) {
      this.incomeErrorMsg = 'Title and amount are required';
      return;
    }

    this.incomeLoading = true;
    this.incomeErrorMsg = '';
    this.incomeSuccessMsg = '';

    const formData = {
      ...this.incomeForm,
      userEmail: this.userEmail,
      amount: parseFloat(this.incomeForm.amount?.toString() || '0'),
      date: this.incomeForm.date || new Date().toISOString().split('T')[0]
    };

    this.http.post('/api/users/add-income', formData).subscribe({
      next: (response: any) => {
        if (response && response.income) {
          // add to incomeList and recentTransactions
          this.incomeList.unshift(response.income);
          this.updateRecentTransactions();
        } else {
          // fallback: add payload as temporary record
          this.incomeList.unshift({ ...(formData as any), _id: 'tmp-' + Date.now() });
          this.updateRecentTransactions();
        }
        this.incomeSuccessMsg = 'Income added successfully!';
        this.resetIncomeForm();
        this.hideAddIncomeModal();
        this.incomeLoading = false;
      },
      error: (error) => {
        this.incomeErrorMsg = error.error?.error || 'Failed to add income';
        this.incomeLoading = false;
      }
    });
  }

  submitExpense(): void {
    if (!this.expenseForm.title || !this.expenseForm.amount) {
      this.expenseErrorMsg = 'Title and amount are required';
      return;
    }

    this.expenseLoading = true;
    this.expenseErrorMsg = '';
    this.expenseSuccessMsg = '';

    const formData = {
      ...this.expenseForm,
      userEmail: this.userEmail,
      amount: parseFloat(this.expenseForm.amount?.toString() || '0'),
      date: this.expenseForm.date || new Date().toISOString().split('T')[0]
    };

    this.http.post('/api/users/add-expense', formData).subscribe({
      next: (response: any) => {
        if (response && response.expense) {
          this.expenseList.unshift(response.expense);
          this.updateRecentTransactions();
        } else {
          this.expenseList.unshift({ ...(formData as any), _id: 'tmp-' + Date.now() });
          this.updateRecentTransactions();
        }
        this.expenseSuccessMsg = 'Expense added successfully!';
        this.resetExpenseForm();
        this.hideAddExpenseModal();
        this.expenseLoading = false;
      },
      error: (error) => {
        this.expenseErrorMsg = error.error?.error || 'Failed to add expense';
        this.expenseLoading = false;
      }
    });
  }

  // Combine incomeList & expenseList -> recentTransactions (used after add/delete)
  updateRecentTransactions(): void {
    const allTransactions = [
      ...this.incomeList.map(item => ({ ...item, type: 'income' })),
      ...this.expenseList.map(item => ({ ...item, type: 'expense' }))
    ];
    allTransactions.sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });
    this.recentTransactions = allTransactions.slice(0, 5);
  }

  // delete operation
  deleteTransaction(tx: Transaction): void {
    if (!tx._id) {
      this.recentTransactions = this.recentTransactions.filter(t => t !== tx);
      return;
    }
    if (!confirm('Delete this transaction?')) return;
    const endpoint = tx.type === 'income'
      ? `/api/users/delete-income/${tx._id}?userEmail=${encodeURIComponent(this.userEmail)}`
      : `/api/users/delete-expense/${tx._id}?userEmail=${encodeURIComponent(this.userEmail)}`;
    this.http.delete(endpoint).subscribe({
      next: () => {
        this.recentTransactions = this.recentTransactions.filter(t => t._id !== tx._id);
      },
      error: (err) => {
        console.error('Delete failed', err);
      }
    });
  }

  // Delete helpers (same endpoints as user-profile)
  deleteIncome(id: string | undefined) {
    if (!id) {
      return;
    }
    if (!confirm('Are you sure you want to delete this income record?')) return;
    this.http.delete(`/api/users/delete-income/${id}?userEmail=${encodeURIComponent(this.userEmail)}`).subscribe({
      next: () => {
        this.incomeList = this.incomeList.filter(income => income._id !== id);
        this.updateRecentTransactions();
      },
      error: (error) => {
        console.error('Error deleting income:', error);
        alert('Failed to delete income record. Please try again.');
      }
    });
  }

  deleteExpense(id: string | undefined) {
    if (!id) {
      return;
    }
    if (!confirm('Are you sure you want to delete this expense record?')) return;
    this.http.delete(`/api/users/delete-expense/${id}?userEmail=${encodeURIComponent(this.userEmail)}`).subscribe({
      next: () => {
        this.expenseList = this.expenseList.filter(exp => exp._id !== id);
        this.updateRecentTransactions();
      },
      error: (error) => {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense record. Please try again.');
      }
    });
  }

  deleteAllIncome() {
    if (!confirm('Are you sure you want to delete ALL income records? This cannot be undone.')) return;
    this.http.delete(`/api/users/delete-all-income?userEmail=${encodeURIComponent(this.userEmail)}`).subscribe({
      next: () => {
        this.incomeList = [];
        this.updateRecentTransactions();
      },
      error: (error) => {
        console.error('Error deleting all income:', error);
        alert('Failed to delete all income records.');
      }
    });
  }

  deleteAllExpenses() {
    if (!confirm('Are you sure you want to delete ALL expense records? This cannot be undone.')) return;
    this.http.delete(`/api/users/delete-all-expenses?userEmail=${encodeURIComponent(this.userEmail)}`).subscribe({
      next: () => {
        this.expenseList = [];
        this.updateRecentTransactions();
      },
      error: (error) => {
        console.error('Error deleting all expenses:', error);
        alert('Failed to delete all expense records.');
      }
    });
  }

  // helpers
  resetIncomeForm(): void {
    this.incomeForm = { title: '', amount: null, category: '', date: this.getCurrentDate(), notes: '', type: 'income' };
  }
  resetExpenseForm(): void {
    this.expenseForm = { title: '', amount: null, category: '', date: this.getCurrentDate(), notes: '', taxDeductible: '', type: 'expense' };
  }
  getCurrentDate(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
}
