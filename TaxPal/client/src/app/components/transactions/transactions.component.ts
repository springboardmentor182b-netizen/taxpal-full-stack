import { Component, OnInit } from '@angular/core';
import { TransactionService, Transaction } from '../../services/transaction.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  loading = false;
  error = '';
  formVisible = false;
  isEditing = false;
  editId: string | null = null;
  form: Transaction = {
    title: '',
    amount: 0,
    type: 'income',
    category: '',
    date: new Date().toISOString(),
    notes: '',
  };

  constructor(private svc: TransactionService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.svc.list().subscribe({
      next: (items) => {
        this.transactions = items;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load';
        this.loading = false;
        console.error(err);
      },
    });
  }

  openAdd(type: 'income' | 'expense') {
    this.resetForm();
    this.form.type = type;
    this.formVisible = true;
    this.isEditing = false;
  }

  startEdit(t: Transaction) {
    this.editId = t._id || null;
    this.form = { ...t };
    this.formVisible = true;
    this.isEditing = true;
  }

  save() {
    const payload = { ...this.form, amount: Number(this.form.amount) };
    if (this.isEditing && this.editId) {
      this.svc.update(this.editId, payload).subscribe({
        next: () => {
          this.formVisible = false;
          this.load();
        },
        error: (e) => console.error(e),
      });
    } else {
      this.svc.create(payload).subscribe({
        next: () => {
          this.formVisible = false;
          this.load();
        },
        error: (e) => console.error(e),
      });
    }
  }

  remove(id?: string) {
    if (!id) return;
    if (!confirm('Delete transaction?')) return;
    this.svc.delete(id).subscribe({
      next: () => this.load(),
      error: (e) => console.error(e),
    });
  }

  resetForm() {
    this.editId = null;
    this.form = {
      title: '',
      amount: 0,
      type: 'income',
      category: '',
      date: new Date().toISOString(),
      notes: '',
    };
  }

  cancel() {
    this.resetForm();
    this.formVisible = false;
  }
}
