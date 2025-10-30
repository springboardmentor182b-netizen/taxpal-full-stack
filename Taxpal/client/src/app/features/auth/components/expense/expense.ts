import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

type ExpensePayload = {
  description: string;
  amount: number | null;    // internal form state can be null
  category: string;
  date: string;             // yyyy-mm-dd
  notes: string;
};

// Emitted type with guaranteed non-null amount
export type ExpenseEmit = Omit<ExpensePayload, 'amount'> & { amount: number };

@Component({
  selector: 'app-expense-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expense-modal.html',
  styleUrls: ['./expense.css']
})
export class ExpenseModalComponent {
  @Input() isOpen = false;

  // parent listens with (closeModal) and (save)
  @Output() closeModal = new EventEmitter<void>();
  @Output() save = new EventEmitter<ExpenseEmit>();

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
    // strictly positive on submit (server also enforces)
    if (d.description?.trim() && d.amount != null && d.amount > 0 && d.category && d.date) {
      const emitPayload: ExpenseEmit = {
        description: d.description.trim(),
        amount: d.amount as number,
        category: d.category,
        date: d.date,
        notes: d.notes
      };
      this.save.emit(emitPayload);
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
    // Strip any minus signs and non-numeric cruft except dot
    const cleaned = input.value.replace(/-/g, '');
    input.value = cleaned;

    const n = parseFloat(cleaned);
    if (!Number.isFinite(n)) {
      this.formData.amount = null;
      return;
    }
    // Clamp to >= 0, and keep two decimals as user types
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
