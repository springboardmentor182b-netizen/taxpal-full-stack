import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type IncomePayload = {
  description: string;
  amount: number | null;
  category: string;
  date: string;   // yyyy-mm-dd
  notes: string;
};

@Component({
  selector: 'app-income-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './income-modal.html',
  styleUrls: ['./income-modal.css']
})
export class IncomeModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() save = new EventEmitter<IncomePayload>();

  formData: IncomePayload = {
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
