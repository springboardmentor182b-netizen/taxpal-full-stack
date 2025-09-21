import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-income-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './income-modal.html',
  styleUrls: ['./income-modal.css']
})
export class IncomeModalComponent {
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