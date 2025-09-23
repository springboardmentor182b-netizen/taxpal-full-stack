import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

type ExpensePayload = {
  description: string;
  amount: number | null;
  category: string;
  date: string;   // yyyy-mm-dd
  notes: string;
};

@Component({
  selector: 'app-expense-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expense-modal.html',
  styleUrls: ['./expense.css']
})
export class ExpenseModalComponent {
  @Input() isOpen = false;

  // renamed to match parent: (closeModal)="closeExpense()"
  @Output() closeModal = new EventEmitter<void>();
  @Output() save = new EventEmitter<ExpensePayload>();

  formData: ExpensePayload = {
    description: '',
    amount: null,
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  };

  onClose() {
    this.closeModal.emit();
    this.resetForm();
  }

  onSave() {
    const d = this.formData;
    if (d.description?.trim() && d.amount != null && d.amount > 0 && d.category && d.date) {
      this.save.emit({ ...d });
      this.onClose();
    }
  }

  private resetForm() {
    this.formData = {
      description: '',
      amount: null,
      category: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    };
  }
}
