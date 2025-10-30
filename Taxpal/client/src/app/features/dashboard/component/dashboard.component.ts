import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart, { Chart as ChartType } from 'chart.js/auto';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BudgetsListComponent } from '../../budgets/component/budgets-list.component';
import { IncomeModalComponent } from '../../auth/components/income/income';
import { ExpenseModalComponent } from '../../auth/components/expense/expense';
import { AuthService, User } from '../../../core/services/auth.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ExpenseService } from '../../../core/services/expense.service';
import { IncomeService } from '../../../core/services/income.service';
import { TransactionService } from '../../../core/services/transaction.service';

type IncomePayloadFromModal = {
  description: string;
  amount: number | null;
  category: string;
  date: string;
  notes: string;
};
type ExpensePayloadFromModal = {
  description: string;
  amount: number | null;
  category: string;
  date: string;
  notes: string;
};
type BudgetModel = {
  name: string;
  category: string;
  amount: number | null;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  notes: string;
  _id?: string;
};
type RecentTx = {
  _id?: string;
  type: 'income' | 'expense';
  description: string;
  category: string;
  amount: number;
  date: string | Date;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    IncomeModalComponent,
    RouterLink,
    ExpenseModalComponent,
    BudgetsListComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  user: User | null = null;

  // Drawer state
  mobileNavOpen = false;

  showIncome = false;
  showExpense = false;
  showBudget = false;

  incomes: any[] = [];
  expenses: any[] = [];
  budgets: BudgetModel[] = [];

  recent: RecentTx[] = [];
  pieHasData = false;
  isDeletingAll = false;

  private pendingBarBumps: Array<{ dateISO: string; delta: number; kind: 'income' | 'expense' }> = [];

  budgetModel: BudgetModel = {
    name: '',
    category: '',
    amount: null,
    period: 'monthly',
    startDate: '',
    endDate: '',
    notes: '',
  };

  cards = {
    income: { amount: 0, changePct: 0 },
    expenses: { amount: 0, changePct: 0 },
    estimatedTaxDues: 0,
    savingsRatePct: 0,
  };

  @ViewChild('barCanvas') private barCanvas?: ElementRef<HTMLCanvasElement>;
  private barChart?: ChartType;
  private pieChart?: ChartType;

  constructor(
    private dash: DashboardService,
    private expensesApi: ExpenseService,
    private incomesApi: IncomeService,
    private router: Router,
    public  auth: AuthService,
    private txApi: TransactionService
  ) {
    this.auth.currentUser$.subscribe(u => { this.user = u; });
    this.user = this.auth.getCurrentUser();
  }

  /* ================= Drawer helpers ================= */
  toggleMobileNav(): void {
    this.mobileNavOpen = !this.mobileNavOpen;
    this.lockScroll(this.mobileNavOpen);
  }
  closeMobileNav(): void {
    this.mobileNavOpen = false;
    this.lockScroll(false);
  }
  closeMobileNavIfSmall(): void {
    if (window.innerWidth <= 1024) this.closeMobileNav();
  }
  private lockScroll(lock: boolean) {
    try { document.body.style.overflow = lock ? 'hidden' : ''; } catch {}
  }
  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && this.mobileNavOpen) this.closeMobileNav();
  }
  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 1024 && this.mobileNavOpen) this.closeMobileNav();
  }

  // GETTERS
  get firstInitial(): string {
    const s = (this.user?.name || this.user?.email || 'U').trim();
    return s ? s[0].toUpperCase() : 'U';
  }
  get secondInitial(): string {
    const n = this.user?.name?.trim();
    if (!n) return '';
    const parts = n.split(/\s+/);
    return (parts[1]?.[0] ?? '').toUpperCase();
  }

  trackByTx = (_: number, tx: RecentTx) => tx._id || tx.date;

  /* ================= Delete One ================= */
  onDeleteRecent(tx: RecentTx) {
    const id = tx._id;
    if (!id) { return; }
    if (!confirm('Delete this transaction?')) return;
    const prevRecent = [...this.recent];
    this.recent = this.recent.filter(r => r._id !== id);
    this.incomes = this.incomes.filter((i: any) => i._id !== id);
    this.expenses = this.expenses.filter((e: any) => e._id !== id);

    this.txApi.deleteTransaction(id).subscribe({
      next: () => {
        this.dash.invalidate();
        this.refreshDashboard(true, true);
      },
      error: (err) => {
        this.recent = prevRecent;
        console.error('Failed to delete transaction', err);
        alert('Failed to delete transaction. Please try again.');
      }
    });
  }

  /* ================= Delete All ================= */
  onDeleteAllRecent() {
    if (!this.recent.length) return;
    if (!confirm('Delete ALL transactions? This cannot be undone.')) return;
    this.isDeletingAll = true;
    this.txApi.deleteAll().subscribe({
      next: () => {
        this.recent = [];
        this.expenses = [];
        this.incomes = [];
        this.isDeletingAll = false;
        this.dash.invalidate();
        this.refreshDashboard(true, true);
      },
      error: (err) => {
        this.isDeletingAll = false;
        console.error('Failed to delete all transactions', err);
        alert('Failed to delete all transactions.');
      }
    });
  }

  openIncome()  { this.showIncome = true;  this.showExpense = false; this.showBudget = false; }
  openExpense() { this.showExpense = true; this.showIncome  = false; this.showBudget = false; }
  closeIncome() { this.showIncome = false; }
  closeExpense(){ this.showExpense = false; }
  openBudget()  { this.showBudget = true;  this.showIncome = false; this.showExpense = false; }
  closeBudget() { this.showBudget = false; }

  saveBudget() {
    const payload: BudgetModel = { ...this.budgetModel, amount: Number(this.budgetModel.amount ?? 0) };
    this.budgets = [payload, ...this.budgets];
    this.budgetModel = { name: '', category: '', amount: null, period: 'monthly', startDate: '', endDate: '', notes: '' };
    this.closeBudget();
  }

  /* ================= Income Save ================= */
  onIncomeSave(evt: IncomePayloadFromModal) {
    const amount = Number(evt?.amount ?? 0);
    if (!amount || amount <= 0 || !evt?.date) return;

    this.bumpBarSeries(evt.date, amount, 'income');

    const tempId = (globalThis as any).crypto?.randomUUID?.() ?? `tmp_${Date.now()}`;
    this.prependRecent({
      _id: tempId, type: 'income',
      description: evt.description?.trim() || 'Income',
      category: evt.category || 'General',
      amount, date: evt.date
    });

    this.incomesApi.create({
      description: evt.description,
      amount, category: evt.category, date: evt.date, notes: evt.notes
    }).subscribe({
      next: (doc: any) => {
        this.replaceRecent(tempId, {
          _id: doc?._id, type: 'income',
          description: doc?.source ?? doc?.description ?? evt.description,
          category: doc?.category ?? evt.category,
          amount: Number(doc?.amount ?? amount),
          date: doc?.date ?? evt.date
        });
        this.dash.invalidate();
        this.loadRecent();
        this.refreshDashboard(true, false);
      },
      error: (err) => {
        this.removeRecent(tempId);
        this.bumpBarSeries(evt.date, -amount, 'income');
        console.error('Failed to save income', err);
      }
    });

    this.incomes.push({ ...evt, amount });
    this.closeIncome();
  }

  /* ================= Expense Save ================= */
  onExpenseSave(evt: ExpensePayloadFromModal) {
    if (evt.amount == null || evt.amount <= 0) return;

    const amount = Number(evt.amount);
    const payload = {
      description: evt.description?.trim() ?? '',
      amount, category: evt.category, date: evt.date, notes: evt.notes ?? '',
    };

    this.bumpBarSeries(payload.date, amount, 'expense');

    const tempId = (globalThis as any).crypto?.randomUUID?.() ?? `tmp_${Date.now()}`;
    const optimistic = { ...payload, _id: tempId, _optimistic: true };
    this.expenses = [optimistic, ...this.expenses];
    this.rebuildPieFromLocal();

    this.prependRecent({
      _id: tempId, type: 'expense',
      description: payload.description || 'Expense',
      category: payload.category || 'General',
      amount, date: payload.date
    });

    this.expensesApi.addExpense(payload).subscribe({
      next: (created) => {
        this.expenses = [created ?? payload, ...this.expenses.filter((e) => e._id !== tempId)];
        this.rebuildPieFromLocal();

        this.replaceRecent(tempId, {
          _id: (created as any)?._id, type: 'expense',
          description: (created as any)?.description ?? payload.description,
          category: (created as any)?.category ?? payload.category,
          amount: Number((created as any)?.amount ?? amount),
          date: (created as any)?.date ?? payload.date
        });

        this.closeExpense();
        this.dash.invalidate();
        this.loadRecent();
        this.refreshDashboard(true, false);
      },
      error: (err) => {
        this.expenses = this.expenses.filter((e) => e._id !== tempId);
        this.removeRecent(tempId);
        this.rebuildPieFromLocal();
        this.bumpBarSeries(payload.date, -amount, 'expense');
        console.error('Failed to save expense', err);
      },
    });
  }

  async ngAfterViewInit(): Promise<void> {
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
    this.refreshDashboard(); // charts+recent
  }

  ngOnDestroy(): void { this.destroyCharts(); }

  private destroyCharts() {
    this.barChart?.destroy();
    this.pieChart?.destroy();
    this.barChart = undefined;
    this.pieChart = undefined;
  }

  /* ================= Dashboard Loaders ================= */
  private refreshDashboard(loadCharts: boolean = true, loadRecentFlag: boolean = true): void {
    // cards & pie
    this.dash.getDashboard(undefined, undefined, true).subscribe({
      next: (res: any) => {
        if (res?.cards) {
          this.cards.income.amount     = res.cards.income?.amount ?? 0;
          this.cards.income.changePct  = res.cards.income?.changePct ?? 0;
          this.cards.expenses.amount   = res.cards.expenses?.amount ?? 0;
          this.cards.expenses.changePct= res.cards.expenses?.changePct ?? 0;
          this.cards.estimatedTaxDues  = res.cards.estimatedTaxDues ?? 0;
          this.cards.savingsRatePct    = res.cards.savingsRatePct ?? 0;
        }

        const apiBreakdown = res?.breakdown?.byCategory;
        if (Array.isArray(apiBreakdown) && apiBreakdown.length) {
          const labels = apiBreakdown.map((x: any) => x.category);
          const values = apiBreakdown.map((x: any) => Number(x.amount) || 0);
          this.upsertPie(labels, values);
          this.pieHasData = values.some(v => v > 0);
        } else {
          this.rebuildPieFromLocal();
        }
      },
      error: () => this.rebuildPieFromLocal(),
    });

    if (loadCharts) {
      this.dash.getIncomeVsExpenses('month', true).subscribe({
        next: (res: any) => {
          const labels: string[] = res?.labels || [];
          const incomeRaw  = res?.series?.find((s: any) => s.label === 'Income')?.data || [];
          const expenseRaw = res?.series?.find((s: any) => s.label === 'Expenses')?.data || [];
          const income     = this.numberfy(incomeRaw, labels.length);
          const expense    = this.numberfy(expenseRaw, labels.length);
          this.upsertBar(labels, income, expense);
        },
        error: (err) => console.error('Failed to load bar series', err),
      });
    }

    if (loadRecentFlag) this.loadRecent();
  }

  private loadRecent(limit: number = 8) {
    this.dash.getRecentTransactions(limit).subscribe({
      next: (res) => {
        const items = (res?.transactions ?? []) as any[];
        this.recent = items.map((t) => ({
          _id: t._id,
          type: t.type,
          description: t.description ?? (t.type === 'income' ? 'Income' : 'Expense'),
          category: t.category ?? 'General',
          amount: Number(t.amount ?? 0),
          date: t.date
        }));
      },
      error: (err) => {
        console.error('Failed to load recent transactions', err);
        this.recent = [];
      }
    });
  }

  private prependRecent(tx: RecentTx) { this.recent = [tx, ...this.recent].slice(0, 8); }
  private replaceRecent(tempId: string, real: RecentTx) {
    const i = this.recent.findIndex(r => r._id === tempId);
    if (i >= 0) { const copy = [...this.recent]; copy[i] = { ...real }; this.recent = copy; }
  }
  private removeRecent(tempId: string) { this.recent = this.recent.filter(r => r._id !== tempId); }

  private rebuildPieFromLocal(): void {
    const totals: Record<string, number> = {};
    for (const e of this.expenses) {
      const cat = (e?.category || 'other').toString();
      const amt = Number(e?.amount || 0);
      totals[cat] = (totals[cat] || 0) + (isFinite(amt) ? amt : 0);
    }
    const labels = Object.keys(totals);
    const values = labels.map((l) => totals[l]);
    this.upsertPie(labels, values);
    this.pieHasData = values.some(v => v > 0);
  }

  private numberfy(arr: any[], targetLen: number): number[] {
    const out = new Array<number>(targetLen).fill(0);
    if (!Array.isArray(arr)) return out;
    for (let i = 0; i < targetLen; i++) {
      const v = arr[i];
      const n = typeof v === 'number' ? v : Number(v);
      out[i] = isFinite(n) ? n : 0;
    }
    return out;
  }

  private upsertBar(labels: string[], income: number[], expenses: number[]) {
    const el = this.barCanvas?.nativeElement;
    if (!el) { console.warn('[bar] canvas not found yet'); return; }

    const size = el.getBoundingClientRect();
    if ((size.width === 0 || size.height === 0) && !this.barChart) {
      requestAnimationFrame(() => this.upsertBar(labels, income, expenses));
      return;
    }

    const L = labels.length;
    const num = (arr: any[]) => {
      const out = new Array<number>(L).fill(0);
      if (Array.isArray(arr)) {
        for (let i = 0; i < L; i++) {
          const v = arr[i];
          const n = typeof v === 'number' ? v : Number(v);
          out[i] = Number.isFinite(n) ? n : 0;
        }
      }
      return out;
    };
    const incomeFixed   = num(income);
    const expensesFixed = num(expenses);

    let apiHasBars = L > 0 && (incomeFixed.some(v => v > 0) || expensesFixed.some(v => v > 0));
    let useLabels   = labels;
    let useIncome   = incomeFixed;
    let useExpenses = expensesFixed;

    if (!L) {
      const scaffold = this.buildCurrentMonthScaffold();
      useLabels   = scaffold.labels;
      useIncome   = scaffold.income;
      useExpenses = scaffold.expenses;
      apiHasBars  = false;
    }

    if (this.barChart) {
      this.barChart.data.labels = useLabels;
      (this.barChart.data.datasets[0].data as number[]) = useIncome;
      (this.barChart.data.datasets[1].data as number[]) = useExpenses;
      this.barChart.update();
      this.applyPendingBarBumps();
      return;
    }

    const ctx = el.getContext('2d');
    if (!ctx) { console.warn('[bar] 2D context not available'); return; }

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: useLabels,
        datasets: [
          { label: 'Income',   data: useIncome,   backgroundColor: '#656ED3', borderRadius: 6 },
          { label: 'Expenses', data: useExpenses, backgroundColor: '#25295A', borderRadius: 6 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 250 },
        scales: {
          x: { grid: { display: false }, border: { display: false }, ticks: { maxRotation: 0, autoSkip: true } },
          y: { beginAtZero: true, grid: { display: true }, border: { display: false } }
        },
        plugins: {
          legend:  { display: true, position: 'top' },
          tooltip: { enabled: true }
        }
      }
    });

    this.applyPendingBarBumps();
  }

  private buildCurrentMonthScaffold(): { labels: string[]; income: number[]; expenses: number[] } {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    const labels: string[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dd = String(d).padStart(2, '0');
      const short = new Date(y, m, d).toLocaleString(undefined, { month: 'short' });
      labels.push(`${dd} ${short}`);
    }
    return { labels, income: new Array(daysInMonth).fill(0), expenses: new Array(daysInMonth).fill(0) };
  }

  private upsertPie(labels: string[], data: number[]) {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement | null;
    if (!ctx) return;

    if (this.pieChart) {
      this.pieChart.data.labels = labels;
      (this.pieChart.data.datasets[0].data as number[]) = data;
      this.pieChart.update();
      return;
    }

    const g = ctx.getContext('2d');
    if (!g) return;

    this.pieChart = new Chart(g, {
      type: 'pie',
      data: { labels, datasets: [{ data, backgroundColor: ['#656ED3', '#25295A', '#8B95F9', '#A1A6D3', '#93A5CF', '#B8C6DB'] }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const raw = typeof ctx.parsed === 'number' ? ctx.parsed : 0;
                const dataset = ctx.dataset.data as number[];
                const sum = dataset.reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);
                const pct = sum ? ((raw * 100) / sum).toFixed(1) : '0.0';
                return `${ctx.label}: $${raw.toFixed(2)} (${pct}%)`;
              },
            },
          },
        },
      },
    });
  }

  private bumpBarSeries(dateISO: string, delta: number, kind: 'income' | 'expense') {
    if (!dateISO || !isFinite(delta)) return;

    if (!this.barChart) {
      this.pendingBarBumps.push({ dateISO, delta, kind });
      return;
    }

    const labels = (this.barChart.data.labels || []) as (string | number)[];
    let idx = this.findBarBucketIndex(dateISO, labels);
    if (idx < 0) {
      idx = labels.length ? labels.length - 1 : -1;
      if (idx < 0) return;
    }

    const dsIndex = kind === 'income' ? 0 : 1;
    const ds = this.barChart.data.datasets[dsIndex];
    const arr = ds.data as number[];
    const curr = Number(arr[idx] ?? 0);
    arr[idx] = curr + delta;
    this.barChart.update();
  }

  private applyPendingBarBumps() {
    if (!this.barChart || !this.pendingBarBumps.length) return;
    const bumps = [...this.pendingBarBumps];
    this.pendingBarBumps = [];
    for (const b of bumps) this.bumpBarSeries(b.dateISO, b.delta, b.kind);
  }

  private findBarBucketIndex(dateISO: string, labels: (string | number)[]): number {
    const d = new Date(dateISO);
    if (isNaN(d.getTime())) return -1;
    const dd = `${d.getDate()}`.padStart(2, '0');
    const short = d.toLocaleString(undefined, { month: 'short' });
    const candidates = [
      `${dd} ${short}`,
      `${dd} ${short}.`,
      `${dd} ${short.replace('Sept', 'Sep')}`,
      `${dd} ${short.replace('Sep', 'Sept')}`,
    ];
    for (const c of candidates) {
      const i = labels.findIndex((l) => String(l) === c);
      if (i >= 0) return i;
    }
    return labels.findIndex((l) => String(l).startsWith(dd + ' '));
  }
}
