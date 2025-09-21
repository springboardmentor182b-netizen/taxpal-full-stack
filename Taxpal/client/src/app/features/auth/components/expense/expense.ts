import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-expense-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expense-modal.html',
  styleUrls: ['./expense.css']
})
export class ExpenseModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  formData = {
    description: '',
    amount: null,
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  };

  closeModal() {
    this.close.emit();
    this.resetForm();
  }

  onSave() {
    if (this.formData.description && this.formData.amount && this.formData.category && this.formData.date) {
      this.save.emit({ ...this.formData });
      this.closeModal();
    }
  }

  resetForm() {
    this.formData = {
      description: '',
      amount: null,
      category: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    };
  }
}
