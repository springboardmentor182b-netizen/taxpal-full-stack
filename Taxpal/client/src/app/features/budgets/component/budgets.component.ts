import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BudgetService } from '../../../core/services/budget.service';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, MatSnackBarModule],
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.css']
})
export class BudgetsComponent implements OnInit {
  @Input()  embedded = false;
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;
  submitting = false;

  categories: readonly string[] = ['Groceries','Rent','Utilities','Transport','Entertainment','Other'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private budgetService: BudgetService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    const now = new Date();
    const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    this.form = this.fb.group({
      category: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0)]], // non-negative
      month: [defaultMonth, Validators.required],
      description: ['', Validators.maxLength(500)]
    });
  }

  isInvalid(ctrl: string): boolean {
    const c = this.form.get(ctrl);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  trackByCategory = (_: number, v: string) => v;

  private finish(): void {
    if (this.embedded) this.close.emit();
    else this.router.navigate(['/dashboard']);
  }

  goBack(): void { this.finish(); }

  /** Normalize any browser-provided month into 'YYYY-MM'. */
  private toYYYYMM(value: unknown): string {
    if (typeof value === 'string') {
      if (/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return value;
      const dmatch = value.match(/^(\d{4})-(\d{2})-\d{2}$/);
      if (dmatch) return `${dmatch[1]}-${dmatch[2]}`;
    }
    const d = new Date(value as any);
    if (!isNaN(d.getTime())) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      return `${y}-${m}`;
    }
    return '';
  }

  /** Block characters that could create negatives or scientific notation */
  blockInvalidAmountKeys(evt: KeyboardEvent) {
    const blocked = ['-', '+', 'e', 'E'];
    if (blocked.includes(evt.key)) {
      evt.preventDefault();
    }
  }

  /** Sanitize pasted/typed value to keep it non-negative decimal */
  onAmountInput(event: Event) {
    const inputEl = event.target as HTMLInputElement;
    const raw = inputEl.value ?? '';

    // Keep digits and a single dot; drop minus/plus/letters (e.g., "1e2" -> "12")
    let cleaned = raw.replace(/[^0-9.]/g, '');
    cleaned = cleaned.replace(/(\..*)\./g, '$1'); // only one dot

    inputEl.value = cleaned;

    const n = cleaned === '' ? NaN : parseFloat(cleaned);
    if (!Number.isFinite(n)) {
      this.form.get('amount')?.setValue(null, { emitEvent: false });
      return;
    }

    const clamped = Math.max(0, n); // non-negative
    // Reflect clamped value in control (and keep caret stable)
    this.form.get('amount')?.setValue(clamped, { emitEvent: false });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;

    const raw = this.form.value;

    const month = this.toYYYYMM(raw.month);
    const body = {
      category: String(raw.category).trim(),
      amount: Math.max(0, Number(raw.amount)), // final guard
      month,                                    // 'YYYY-MM'
      description: String(raw.description || '').trim() || undefined
    };

    this.budgetService.create(body).subscribe({
      next: () => {
        this.submitting = false;
        this.form.reset();

        this.snack.open('Budget created successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snack-success']
        });

        this.finish();
      },
      error: (e: HttpErrorResponse) => {
        this.submitting = false;

        const msg =
          e?.error?.error ||
          (e?.status === 409 ? 'Budget already exists for this month & category.' :
           e?.status === 400 ? 'Please check the form (month must be YYYY-MM, amount ≥ 0).' :
           'Something went wrong. Please try again.');

        this.snack.open(msg, 'Dismiss', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snack-error']
        });

        console.error('Create budget failed:', { status: e?.status, url: e?.url, error: e?.error });
      }
    });
  }
}
