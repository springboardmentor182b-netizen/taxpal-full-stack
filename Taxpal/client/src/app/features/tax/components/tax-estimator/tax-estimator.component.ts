import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {
  TaxEstimatorService,
  EstimatorInput,
  TaxSummary,
} from '@/app/core/services/tax-estimator.service';
import { TaxCalendarService } from '@/app/core/services/tax-calendar.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

type Q = 'Q1'|'Q2'|'Q3'|'Q4';

// --- inline snackbar types ---
type SnackKind = 'success' | 'error' | 'info';
type Snack = { id: string; text: string; kind: SnackKind };

@Component({
  selector: 'app-tax-estimator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tax-estimator.component.html',
  styleUrls: ['./tax-estimator.component.css'],
})
export class TaxEstimatorComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  form: FormGroup;

  countries: string[] = [];
  statesByCountry: Record<string, string[]> = {};
  filingStatuses: string[] = [];
  quarters: { id: Q; label: string }[] = [];

  summary: TaxSummary = { gross: 0, deductions: 0, taxable: 0, estimatedTax: 0 };

  // button state
  status: 'idle' | 'calculating' | 'success' | 'error' = 'idle';

  // --- inline snackbar state ---
  snacks: Snack[] = [];
  private newId(): string {
    // prefer crypto if available; fallback to Math.random
    // @ts-ignore
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  showSnack(text: string, kind: SnackKind = 'info', durationMs = 3000) {
    const id = this.newId();
    this.snacks = [...this.snacks, { id, text, kind }];
    if (durationMs > 0) setTimeout(() => this.dismissSnack(id), durationMs);
  }
  dismissSnack(id: string) {
    this.snacks = this.snacks.filter(s => s.id !== id);
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private taxSvc: TaxEstimatorService,
    private calendarSvc: TaxCalendarService
  ) {
    this.form = this.fb.group({
      country: ['United States', Validators.required],
      state: ['California', Validators.required],
      status: ['Single', Validators.required],
      quarter: ['Q2', Validators.required],
      grossIncome: [0, [Validators.min(0)]],
      businessExpenses: [0, [Validators.min(0)]],
      retirement: [0, [Validators.min(0)]],
      health: [0, [Validators.min(0)]],
      homeOffice: [0, [Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.countries = this.taxSvc.getCountries();
    this.statesByCountry = this.taxSvc.getStatesByCountry();
    this.filingStatuses = this.taxSvc.getFilingStatuses();
    this.quarters = this.taxSvc.getQuarters(2025) as any;

    this.form.get('country')!.valueChanges.subscribe((c: string) => {
      const states = this.statesByCountry[c] || [];
      const current = this.form.get('state')!.value;
      if (!states.includes(current)) {
        this.form.get('state')!.setValue(states[0] ?? '');
      }
    });
  }

  onClose(): void {
    this.close.emit();
    this.router.navigate(['/tax-calendar']);
  }

  /** Calculate via backend (saves record), then add calendar events automatically */
  calc(): void {
    const v = this.form.value as EstimatorInput;

    // 1) Always compute a local (US-style) estimate for display
    this.summary = this.computeLocalSummary();

    // 2) Proceed with backend call (for persistence & calendar)
    this.status = 'calculating';
    this.showSnack('Calculating on server…', 'info', 1500);

    const taxYear = 2025;

    this.taxSvc.calculateEstimateBackend(v, taxYear).subscribe({
      next: (serverSummary) => {
        this.status = 'success';
        this.showSnack('Done! Server calculated your tax and saved a record.', 'success');

        // Only adopt the server summary if it looks valid (non-zero)
        if (serverSummary && serverSummary.estimatedTax > 0) {
          this.summary = serverSummary;
        }

        // After success, create Calendar events (payment + reminder)
        const q = (this.form.value.quarter as Q) || 'Q1';
        const due = this.estimateDueDate(q, taxYear, this.form.value.country);

        const paymentTitle = `${q} Estimated Tax Payment`;
        const reminderTitle = `Reminder: ${q} Estimated Tax Payment`;
        const reminderDate = new Date(due.getTime() - 14 * 24 * 60 * 60 * 1000); // 14 days before

        const payment$ = this.calendarSvc.addItem({
          title: paymentTitle,
          date: this.toISODate(due),
          note: `Estimated tax payment due on ${due.toDateString()}.`,
        }).pipe(catchError(() => of(null)));

        const reminder$ = this.calendarSvc.addItem({
          title: reminderTitle,
          date: this.toISODate(reminderDate),
          note: `Reminder for upcoming ${q} estimated tax payment due on ${due.toDateString()}.`,
        }).pipe(catchError(() => of(null)));

        forkJoin([payment$, reminder$]).subscribe(([p, r]) => {
          const count = (p ? 1 : 0) + (r ? 1 : 0);
          if (count > 0) {
            this.showSnack(`Calendar updated with ${count} item${count > 1 ? 's' : ''}.`, 'success');
          } else {
            this.showSnack('Could not update calendar (server likely offline).', 'error');
          }
        });
      },
      error: (err) => {
        console.error('[tax-estimator] backend error, showing local estimate only:', err);
        // We already set the local summary above
        this.status = 'error';
        this.showSnack('Backend unavailable — showing local estimate (not saved).', 'error');
      },
    });
  }

  /**
   * US-like progressive estimate for Single filer (approx. 2024 brackets).
   * This is intentionally simple and for product rough estimation.
   */
  private computeLocalSummary(): TaxSummary {
    const n = (x: any) => (isFinite(+x) ? +x : 0);
    const gross = n(this.form.value.grossIncome);
    const deductions =
      n(this.form.value.businessExpenses) +
      n(this.form.value.retirement) +
      n(this.form.value.health) +
      n(this.form.value.homeOffice);

    const taxable = Math.max(0, gross - deductions);

    // Progressive brackets (Single filer, approx. 2024):
    const brackets = [
      { upto: 11600, rate: 0.10 },
      { upto: 47150, rate: 0.12 },
      { upto: 100525, rate: 0.22 },
      { upto: 191950, rate: 0.24 },
      { upto: 243725, rate: 0.32 },
      { upto: 609350, rate: 0.35 },
      { upto: Infinity, rate: 0.37 },
    ];

    let remaining = taxable;
    let lastCap = 0;
    let tax = 0;

    for (const b of brackets) {
      const span = Math.max(0, Math.min(remaining, b.upto - lastCap));
      if (span <= 0) { lastCap = b.upto; continue; }
      tax += span * b.rate;
      remaining -= span;
      lastCap = b.upto;
      if (remaining <= 0) break;
    }

    return { gross, deductions, taxable, estimatedTax: Math.max(0, Math.round(tax * 100) / 100) };
  }

  /** basic US-like due dates; reused for all countries for now */
  private estimateDueDate(q: Q, year: number, _country: string): Date {
    switch (q) {
      case 'Q1': return new Date(year, 3, 15);     // Apr
      case 'Q2': return new Date(year, 5, 15);     // Jun
      case 'Q3': return new Date(year, 8, 15);     // Sep
      case 'Q4': return new Date(year + 1, 0, 15); // Jan next year
    }
  }

  private toISODate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  /** 👇 Always format in US Dollars */
  asCurrency(n: number): string {
    return isFinite(n)
      ? n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
      : '—';
  }
}
