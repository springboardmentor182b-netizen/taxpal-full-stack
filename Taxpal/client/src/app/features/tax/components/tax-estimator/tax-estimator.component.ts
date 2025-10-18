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

  // UI status indicators
  status: 'idle' | 'calculating' | 'success' | 'error' = 'idle';
  statusMsg = '';
  calendarMsg = '';

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
    // load dropdown data from service
    this.countries = this.taxSvc.getCountries();
    this.statesByCountry = this.taxSvc.getStatesByCountry();
    this.filingStatuses = this.taxSvc.getFilingStatuses();
    this.quarters = this.taxSvc.getQuarters(2025) as any; // safe cast to keep literal type

    // keep state in-sync with country
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
    this.calendarMsg = '';
    const v = this.form.value as EstimatorInput;

    this.status = 'calculating';
    this.statusMsg = 'Calculating on server and saving a record...';

    // choose year – you can derive from selected quarter if needed
    const taxYear = 2025;

    this.taxSvc.calculateEstimateBackend(v, taxYear).subscribe({
      next: (summary) => {
        this.summary = summary;
        this.status = 'success';
        this.statusMsg = 'Done! Server calculated your tax and saved a record.';

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
            this.calendarMsg = `Calendar updated with ${count} item${count > 1 ? 's' : ''}.`;
          } else {
            this.calendarMsg = 'Could not update calendar (server likely offline).';
          }
        });
      },
      error: (err) => {
        console.error('[tax-estimator] backend error, falling back to local calc:', err);
        // Fallback to local calculator, but let the user know it wasn’t saved
        this.summary = this.taxSvc.calculateEstimateLocal(v);
        this.status = 'error';
        this.statusMsg = 'Backend unavailable — showing local estimate (not saved).';
      },
    });
  }

  /** basic US-like due dates; reused for all countries for now */
  private estimateDueDate(q: Q, year: number, country: string): Date {
    // US safe defaults: Q1 Apr 15, Q2 Jun 15, Q3 Sep 15, Q4 Jan 15 of next year
    switch (q) {
      case 'Q1': return new Date(year, 3, 15);         // Apr (0-indexed month 3)
      case 'Q2': return new Date(year, 5, 15);         // Jun
      case 'Q3': return new Date(year, 8, 15);         // Sep
      case 'Q4': return new Date(year + 1, 0, 15);     // Jan next year
    }
  }

  private toISODate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  asCurrency(n: number): string {
    const code =
      this.form.value.country === 'India' ? 'INR' :
      this.form.value.country === 'Canada' ? 'CAD' : 'USD';

    return isFinite(n)
      ? n.toLocaleString(undefined, { style: 'currency', currency: code, maximumFractionDigits: 2 })
      : '—';
  }
}
