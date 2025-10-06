import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';  // 👈 add
import { BudgetService } from '../../../core/services/budget.service';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, MatSnackBarModule], // 👈 add MatSnackBarModule
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
    private snack: MatSnackBar                                         // 👈 inject
  ) {}

  ngOnInit(): void {
    const now = new Date();
    const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    this.form = this.fb.group({
      category: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0)]],
      month: [defaultMonth, Validators.required],   // value should be 'YYYY-MM'
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
      const dmatch = value.match(/^(\d{4})-(\d{2})-\d{2}$/);               // 'YYYY-MM-DD'
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
      amount: Number(raw.amount),
      month,                                      // 'YYYY-MM'
      description: String(raw.description || '').trim() || undefined
      // monthStart is omitted; server derives it
    };

    this.budgetService.create(body).subscribe({
      next: () => {
        this.submitting = false;
        this.form.reset();

        // ✅ success popup
        this.snack.open('Budget created successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snack-success'] // optional custom style
        });

        this.finish(); // navigate/close after showing the toast
      },
      error: (e: HttpErrorResponse) => {
        this.submitting = false;

        const msg =
          e?.error?.error ||
          (e?.status === 409 ? 'Budget already exists for this month & category.' :
           e?.status === 400 ? 'Please check the form (month must be YYYY-MM, amount ≥ 0).' :
           'Something went wrong. Please try again.');

        // ❌ error popup
        this.snack.open(msg, 'Dismiss', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snack-error'] // optional custom style
        });

        console.error('Create budget failed:', { status: e?.status, url: e?.url, error: e?.error });
      }
    });
  }
}
