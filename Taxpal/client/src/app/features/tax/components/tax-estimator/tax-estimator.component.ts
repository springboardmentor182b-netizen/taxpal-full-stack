// tax-estimator.component.ts
import { Component, OnInit, Output, EventEmitter, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  TaxEstimatorService,
  EstimatorInput,
  TaxSummary,
} from '@/app/core/services/tax-estimator.service';
  import { TaxCalendarService } from '@/app/core/services/tax-calendar.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BudgetsListComponent } from '../../../budgets/component/budgets-list.component';

/* Optional auth service used in the sidebar profile/logout */
import { AuthService } from '@/app/core/services/auth.service';

type Q = 'Q1' | 'Q2' | 'Q3' | 'Q4';

// --- inline snackbar types ---
type SnackKind = 'success' | 'error' | 'info';
type Snack = { id: string; text: string; kind: SnackKind };

@Component({
  selector: 'app-tax-estimator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, BudgetsListComponent],
  templateUrl: './tax-estimator.component.html',
  styleUrls: ['./tax-estimator.component.css'],
})
export class TaxEstimatorComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  /* ===== Sidebar / layout state ===== */
  mobileNavOpen = false;
  user: { name?: string; email?: string } | null = null;

  get firstInitial(): string {
    const n = (this.user?.name || '').trim();
    return n ? n[0].toUpperCase() : (this.user?.email?.[0] || 'U').toUpperCase();
  }
  get secondInitial(): string {
    const n = (this.user?.name || '').trim().split(/\s+/);
    if (n.length >= 2 && n[1]) return n[1][0].toUpperCase();
    const e = (this.user?.email || '').split('@')[0];
    return e && e.length >= 2 ? e[1].toUpperCase() : '';
  }
  toggleMobileNav() { this.mobileNavOpen = !this.mobileNavOpen; }
  closeMobileNav() { this.mobileNavOpen = false; }
  closeMobileNavIfSmall() { if (window.innerWidth <= 1024) this.mobileNavOpen = false; }

  /* ===== Budgets modal (same behavior as Dashboard) ===== */
  showBudget = false;
  openBudget()  { this.showBudget = true;  this.closeMobileNavIfSmall(); }
  closeBudget() { this.showBudget = false; }

  /* ===== Tabs ===== */
  activeTab: 'form' | 'summary' = 'form';
  switchTab(tab: 'form' | 'summary') {
    this.activeTab = tab;
    if (tab === 'summary') this.summary = this.computeLocalSummary(); // ensure up-to-date
  }

  /* ===== Estimator form state ===== */
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
    // @ts-ignore
    if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) return (crypto as any).randomUUID();
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  showSnack(text: string, kind: SnackKind = 'info', durationMs = 3000) {
    const id = this.newId();
    this.snacks = [...this.snacks, { id, text, kind }];
    if (durationMs > 0) setTimeout(() => this.dismissSnack(id), durationMs);
  }
  dismissSnack(id: string) { this.snacks = this.snacks.filter(s => s.id !== id); }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private taxSvc: TaxEstimatorService,
    private calendarSvc: TaxCalendarService,
    @Optional() public auth?: AuthService
  ) {
    this.form = this.fb.group({
      country: ['United States', Validators.required],
      state: ['California', Validators.required],
      status: ['Single', Validators.required],
      quarter: ['Q2', Validators.required],
      // Non-negative numeric controls
      grossIncome: [0, [Validators.min(0)]],
      businessExpenses: [0, [Validators.min(0)]],
      retirement: [0, [Validators.min(0)]],
      health: [0, [Validators.min(0)]],
      homeOffice: [0, [Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    // Populate sidebar user via a safe adapter
    this.user = this.readUserFromAuth();

    this.countries = this.taxSvc.getCountries();
    this.statesByCountry = this.taxSvc.getStatesByCountry();
    this.filingStatuses = this.taxSvc.getFilingStatuses();
    this.quarters = this.taxSvc.getQuarters(2025) as any;

    this.form.get('country')!.valueChanges.subscribe((c: string) => {
      const states = this.statesByCountry[c] || [];
      const current = this.form.get('state')!.value;
      if (!states.includes(current)) this.form.get('state')!.setValue(states[0] ?? '');
    });

    // Live local summary when any value changes
    this.form.valueChanges.subscribe(() => {
      this.summary = this.computeLocalSummary();
    });

    // Ensure summary is initialized (not 0) for default values
    this.summary = this.computeLocalSummary();
  }

  /** Read user from whatever your AuthService exposes (tolerant to variations) */
  private readUserFromAuth(): { name?: string; email?: string } | null {
    const a: any = this.auth;
    if (!a) return null;

    try {
      if (typeof a.getUser === 'function') return a.getUser() || null;
      if (typeof a.currentUser === 'function') return a.currentUser() || null;
      if (a.currentUser) return a.currentUser;
      if (a.user) return a.user;
      if (a.user$?.getValue) return a.user$.getValue();
      if (a.user$?.value) return a.user$.value;
    } catch {}

    try {
      const raw = localStorage.getItem('user') || localStorage.getItem('auth_user');
      if (raw) return JSON.parse(raw);
    } catch {}

    return null;
  }

  /** Safe logout that works even if logout is missing */
  onLogout(evt: Event) {
    evt.preventDefault();
    const a: any = this.auth;
    try {
      if (a && typeof a.logout === 'function') a.logout();
      else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } finally {
      this.closeMobileNavIfSmall();
      this.router.navigateByUrl('/login');
    }
  }

  onClose(): void {
    this.close.emit();
    this.router.navigate(['/tax-calendar']);
  }

  /** Block characters that could create negatives or scientific notation */
  blockInvalidNumberKeys(evt: KeyboardEvent) {
    const blocked = ['-', '+', 'e', 'E'];
    if (blocked.includes(evt.key)) {
      evt.preventDefault();
    }
  }

  /** Sanitize pasted/typed values so they are always non-negative decimals */
  onNumberInput(control: keyof EstimatorInput, event: Event) {
    const input = event.target as HTMLInputElement;
    const raw = input.value ?? '';

    // Keep digits and a single dot; drop minus/plus/letters (e.g., "1e2" -> "12")
    let cleaned = raw.replace(/[^0-9.]/g, '');
    cleaned = cleaned.replace(/(\..*)\./g, '$1'); // only one dot

    const n = cleaned === '' ? NaN : parseFloat(cleaned);
    if (!Number.isFinite(n)) {
      this.form.get(String(control))?.setValue(0, { emitEvent: false });
      input.value = '';
      // Keep summary fresh
      this.summary = this.computeLocalSummary();
      return;
    }

    const clamped = Math.max(0, n); // non-negative
    // Set control value without creating loops; reflect clamped string into input
    this.form.get(String(control))?.setValue(clamped, { emitEvent: false });
    input.value = String(clamped);

    // Live recompute
    this.summary = this.computeLocalSummary();
  }

  /** Calculate via backend (saves record), then add calendar events automatically */
  calc(): void {
    const v = this.form.value as EstimatorInput;

    // 1) Always compute a local estimate for display (never stuck at 0 if taxable > 0)
    this.summary = this.computeLocalSummary();

    // 2) Proceed with backend call (for persistence & calendar)
    this.status = 'calculating';
    this.showSnack('Calculating on server…', 'info', 1500);

    const taxYear = 2025;

    this.taxSvc.calculateEstimateBackend(v, taxYear).subscribe({
      next: (serverSummary) => {
        this.status = 'success';
        this.showSnack('Done! Server calculated your tax and saved a record.', 'success');

        // Prefer valid server result; otherwise keep local
        const valid =
          serverSummary &&
          [serverSummary.gross, serverSummary.deductions, serverSummary.taxable, serverSummary.estimatedTax]
            .every(x => typeof x === 'number' && isFinite(x as number));

        if (valid) {
          // If server yields 0 but local is > 0, keep local (prevents confusing zeros)
          const local = this.computeLocalSummary();
          const serverEst = Number(serverSummary.estimatedTax) || 0;
          this.summary = serverEst > 0 ? {
            gross: Number(serverSummary.gross) || local.gross,
            deductions: Number(serverSummary.deductions) || local.deductions,
            taxable: Number(serverSummary.taxable) || local.taxable,
            estimatedTax: serverEst
          } : local;
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
    const gross = Math.max(0, n(this.form.value.grossIncome));
    const deductions =
      Math.max(0, n(this.form.value.businessExpenses)) +
      Math.max(0, n(this.form.value.retirement)) +
      Math.max(0, n(this.form.value.health)) +
      Math.max(0, n(this.form.value.homeOffice));

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

    const estimated = Math.max(0, Math.round(tax * 100) / 100);

    return { gross, deductions, taxable, estimatedTax: estimated };
  }

  /** basic US-like due dates; reused for all countries for now */
  private estimateDueDate(q: Q, year: number, _country: string): Date {
    switch (q) {
      case 'Q1': return new Date(year, 3, 15);     // Apr 15
      case 'Q2': return new Date(year, 5, 15);     // Jun 15
      case 'Q3': return new Date(year, 8, 15);     // Sep 15
      case 'Q4': return new Date(year + 1, 0, 15); // Jan 15 next year
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
