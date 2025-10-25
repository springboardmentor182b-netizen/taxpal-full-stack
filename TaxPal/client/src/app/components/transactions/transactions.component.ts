import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';

interface Transaction {
  _id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  loading: boolean = true;
  error: string = '';
  showModal: boolean = false;
  isEditMode: boolean = false;
  modalType: 'income' | 'expense' = 'income';

  transactionForm = {
    _id: '',
    description: '',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
    type: 'income' as 'income' | 'expense',
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

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;
    this.transactionService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load transactions';
        this.loading = false;
        console.error('Error loading transactions:', err);
      },
    });
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
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveTransaction(): void {
    if (this.isEditMode) {
      this.transactionService
        .updateTransaction(this.transactionForm._id, this.transactionForm)
        .subscribe({
          next: () => {
            this.loadTransactions();
            this.closeModal();
          },
          error: (err) => {
            console.error('Error updating transaction:', err);
            alert('Failed to update transaction');
          },
        });
    } else {
      this.transactionService.addTransaction(this.transactionForm).subscribe({
        next: () => {
          this.loadTransactions();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error adding transaction:', err);
          alert('Failed to add transaction');
        },
      });
    }
  }

  deleteTransaction(id: string): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(id).subscribe({
        next: () => {
          this.transactions = this.transactions.filter((t) => t._id !== id);
        },
        error: (err) => {
          console.error('Error deleting transaction:', err);
          alert('Failed to delete transaction');
        },
      });
    }
  }

  getCategories(): string[] {
    return this.modalType === 'income' ? this.incomeCategories : this.expenseCategories;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  isFormValid(): boolean {
    return (
      this.transactionForm.description.trim() !== '' &&
      this.transactionForm.amount > 0 &&
      this.transactionForm.category !== '' &&
      this.transactionForm.date !== ''
    );
  }
}
