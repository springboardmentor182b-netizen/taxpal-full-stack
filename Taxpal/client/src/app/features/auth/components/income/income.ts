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
  private validateForm(): boolean {
    let valid = true;

    // description required
    if (!this.formData.description || !this.formData.description.trim()) {
      this.errors.description = 'Description is required.';
      valid = false;
    }

    // amount required & > 0
    if (this.formData.amount === null || this.formData.amount === undefined || this.formData.amount === '') {
      this.errors.amount = 'Amount is required.';
      valid = false;
    } else {
      const amountNum = Number(this.formData.amount);
      // check numeric and > 0
      if (Number.isNaN(amountNum)) {
        this.errors.amount = 'Amount must be a number.';
        valid = false;
      } else if (amountNum <= 0) {
        this.errors.amount = 'Amount must be greater than 0.';
        valid = false;
      } else {
        // optional: limit to two decimals
        const asFixed = Math.round(amountNum * 100) / 100;
        this.formData.amount = asFixed;
      }
    }

    // category required
    if (!this.formData.category || !this.formData.category.trim()) {
      this.errors.category = 'Category is required.';
      valid = false;
    }

    // date required + format check (yyyy-mm-dd)
    if (!this.formData.date) {
      this.errors.date = 'Date is required.';
      valid = false;
    } else {
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!isoDateRegex.test(this.formData.date)) {
        this.errors.date = 'Date must be in YYYY-MM-DD format.';
        valid = false;
      } else {
        // further check for a valid calendar date
        const d = new Date(this.formData.date + 'T00:00:00');
        if (Number.isNaN(d.getTime())) {
          this.errors.date = 'Invalid date.';
          valid = false;
        }
      }
    }

    return valid;
  }

  private clearErrors() {
    this.errors = {};
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
