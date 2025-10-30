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
    // strictly positive on submit (server should enforce too)
    if (d.description?.trim() && d.amount != null && d.amount > 0 && d.category && d.date) {
      this.save.emit({ ...d });
      this.onClose();
    }
  }

  /** Prevent typing of characters that enable negatives/exponents in number inputs */
  blockInvalidAmountKeys(evt: KeyboardEvent) {
    const blocked = ['-', '+', 'e', 'E'];
    if (blocked.includes(evt.key)) {
      evt.preventDefault();
    }
  }

  /** Sanitize pasted/typed values so they can never be negative */
  onAmountInput(event: Event) {
    const input = event.target as HTMLInputElement;
    // Strip minus signs (paste or IME), keep digits and dot
    const cleaned = input.value.replace(/-/g, '');
    input.value = cleaned;

    const n = parseFloat(cleaned);
    if (!Number.isFinite(n)) {
      this.formData.amount = null;
      return;
    }
    // Clamp to >= 0
    const clamped = Math.max(0, n);
    this.formData.amount = clamped;
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
