import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Transaction {
  _id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
  notes?: string;
  taxDeductible?: string;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  groupedTransactions: { date: string; transactions: Transaction[] }[] = [];
  loading: boolean = true;
  error: string = '';
  showModal: boolean = false;
  isEditMode: boolean = false;
  modalType: 'income' | 'expense' = 'income';

  transactionForm: {
    _id: string;
    description: string;
    amount: number;
    category: string;
    date: string;
    type: 'income' | 'expense';
    notes?: string;
    taxDeductible?: string;
  } = {
    _id: '',
    description: '',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
    type: 'income',
    notes: '',
    taxDeductible: '',
  };

  incomeCategories = ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'];
  expenseCategories = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Entertainment',
    'Health',
    'Education',
    'Other',
  ];

  userEmail: string = '';
  incomeList: any[] = [];
  expenseList: any[] = [];

  searchQuery: string = '';
  filterType: 'all' | 'income' | 'expense' = 'all';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('user_email') || '';
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;
    this.error = '';

    // Fetch both income and expense lists
    Promise.all([
      this.http
        .get<any[]>(`/api/users/income-list?userEmail=${encodeURIComponent(this.userEmail)}`)
        .toPromise(),
      this.http
        .get<any[]>(`/api/users/expense-list?userEmail=${encodeURIComponent(this.userEmail)}`)
        .toPromise(),
    ])
      .then(([incomes, expenses]) => {
        // Transform income list to transaction format
        const incomeTransactions: Transaction[] = (incomes || []).map((item) => ({
          _id: item._id,
          type: 'income' as 'income',
          description: item.title,
          amount: item.amount,
          category: item.category || 'Uncategorized',
          date: item.date,
          notes: item.notes,
        }));

        // Transform expense list to transaction format
        const expenseTransactions: Transaction[] = (expenses || []).map((item) => ({
          _id: item._id,
          type: 'expense' as 'expense',
          description: item.title,
          amount: item.amount,
          category: item.category || 'Uncategorized',
          date: item.date,
          notes: item.notes,
          taxDeductible: item.taxDeductible,
        }));

        // Combine and sort by date (newest first)
        this.transactions = [...incomeTransactions, ...expenseTransactions].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        this.filterTransactions();
        this.loading = false;
      })
      .catch((err) => {
        this.error = 'Failed to load transactions';
        this.loading = false;
        console.error('Error loading transactions:', err);
      });
  }

  filterTransactions(): void {
    let filtered = [...this.transactions];

    // Apply type filter
    if (this.filterType !== 'all') {
      filtered = filtered.filter((t) => t.type === this.filterType);
    }

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query) ||
          (t.notes && t.notes.toLowerCase().includes(query))
      );
    }

    this.filteredTransactions = filtered;
    this.groupTransactionsByDate();
  }

  groupTransactionsByDate(): void {
    const grouped = new Map<string, Transaction[]>();

    this.filteredTransactions.forEach((transaction) => {
      const dateKey = this.formatDateForGrouping(transaction.date);
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(transaction);
    });

    this.groupedTransactions = Array.from(grouped.entries()).map(([date, transactions]) => ({
      date,
      transactions,
    }));
  }

  formatDateForGrouping(date: any): string {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
  }

  openAddTransactionModal(type: 'income' | 'expense'): void {
    this.isEditMode = false;
    this.modalType = type;
    this.transactionForm = {
      _id: '',
      description: '',
      amount: 0,
      category: '',
      date: new Date().toISOString().split('T')[0],
      type: type,
      notes: '',
      taxDeductible: '',
    };
    this.showModal = true;
  }

  openEditTransactionModal(transaction: Transaction): void {
    this.isEditMode = true;
    this.modalType = transaction.type;
    this.transactionForm = {
      _id: transaction._id,
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category,
      date: new Date(transaction.date).toISOString().split('T')[0],
      type: transaction.type,
      notes: transaction.notes || '',
      taxDeductible: transaction.taxDeductible || '',
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveTransaction(): void {
    if (!this.isFormValid()) return;

    const endpoint =
      this.modalType === 'income' ? '/api/users/add-income' : '/api/users/add-expense';
    const payload = {
      userEmail: this.userEmail,
      title: this.transactionForm.description,
      amount: parseFloat(this.transactionForm.amount.toString()),
      category: this.transactionForm.category,
      date: this.transactionForm.date,
      notes: this.transactionForm.notes || '',
      ...(this.modalType === 'expense' && {
        taxDeductible: this.transactionForm.taxDeductible || 'no',
      }),
    };

    if (this.isEditMode) {
      // For edit mode, you may need to add update endpoints
      // For now, we'll just reload after changes
      this.http.post(endpoint, payload).subscribe({
        next: () => {
          this.loadTransactions();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error saving transaction:', err);
          this.error = 'Failed to save transaction';
        },
      });
    } else {
      this.http.post(endpoint, payload).subscribe({
        next: () => {
          this.loadTransactions();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error adding transaction:', err);
          this.error = 'Failed to add transaction';
        },
      });
    }
  }

  deleteTransaction(id: string) {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    // Find transaction type to determine which endpoint to use
    const transaction = this.transactions.find((t) => t._id === id);
    if (!transaction) return;

    const endpoint =
      transaction.type === 'income'
        ? `/api/users/delete-income/${id}?userEmail=${encodeURIComponent(this.userEmail)}`
        : `/api/users/delete-expense/${id}?userEmail=${encodeURIComponent(this.userEmail)}`;

    this.http.delete(endpoint).subscribe({
      next: () => {
        this.loadTransactions();
      },
      error: (err) => {
        console.error('Error deleting transaction:', err);
        this.error = 'Failed to delete transaction';
      },
    });
  }

  getCategories(): string[] {
    if (this.modalType === 'income') {
      return ['Freelance Work', 'Consulting', 'Contract Work', 'Services', 'Product Sale', 'Other'];
    } else {
      return [
        'Rent/Mortgage',
        'Utilities',
        'Business Expenses',
        'Food',
        'Transportation',
        'Insurance',
        'Marketing',
        'Office Supplies',
        'Software & Subscriptions',
        'Travel',
        'Other',
      ];
    }
  }

  formatDate(date: any): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  isFormValid(): boolean {
    return (
      this.transactionForm.description.trim() !== '' &&
      this.transactionForm.amount > 0 &&
      this.transactionForm.category !== '' &&
      this.transactionForm.date !== ''
    );
  }

  setFilter(type: 'all' | 'income' | 'expense'): void {
    this.filterType = type;
    this.filterTransactions();
  }
}
