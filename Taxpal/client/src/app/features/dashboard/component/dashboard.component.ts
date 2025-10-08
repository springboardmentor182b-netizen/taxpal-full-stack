import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart, { Chart as ChartType } from 'chart.js/auto';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BudgetsListComponent } from '../../budgets/component/budgets-list.component';
import { IncomeModalComponent } from '../../auth/components/income/income';
import { ExpenseModalComponent } from '../../auth/components/expense/expense';

import { DashboardService } from '../../dashboard/service/dashboard.service';
import { ExpenseService } from '../../../core/services/expense.service';

type IncomePayloadFromModal = {
  description: string;
  amount: number | null;
  category: string;
  date: string; // yyyy-mm-dd
  notes: string;
};

type ExpensePayloadFromModal = {
  description: string;
  amount: number | null;
  category: string;
  date: string; // yyyy-mm-dd
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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    IncomeModalComponent,
    RouterLink,            // needed for routerLink in template
    ExpenseModalComponent,
    BudgetsListComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  showIncome = false;
  showExpense = false;
  showBudget = false;

  incomes: any[] = [];
  expenses: any[] = [];
  budgets: BudgetModel[] = [];

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
    private router: Router
  ) {}

  // ✅ Open Tax Calendar in the SAME SPA tab
  goToTaxCalendar(ev: Event) {
    ev.preventDefault();               // stop default anchor navigation
    this.router.navigate(['/tax-calendar']);
  }

  // ===== Sidebar / Top buttons =====
  openIncome()  { this.showIncome = true;  this.showExpense = false; this.showBudget = false; }
  openExpense() { this.showExpense = true; this.showIncome  = false; this.showBudget = false; }
  closeIncome() { this.showIncome = false; }
  closeExpense(){ this.showExpense = false; }

  // ===== Budgets — inline modal =====
  openBudget()  { this.showBudget = true;  this.showIncome = false; this.showExpense = false; }
  closeBudget() { this.showBudget = false; }

  // Optional local “save” if you keep an old inline budget block
  saveBudget() {
    const payload: BudgetModel = { ...this.budgetModel, amount: Number(this.budgetModel.amount ?? 0) };
    this.budgets = [payload, ...this.budgets];
    this.budgetModel = { name: '', category: '', amount: null, period: 'monthly', startDate: '', endDate: '', notes: '' };
    this.closeBudget();
  }

  // ===================== INCOME SAVE =====================
  onIncomeSave(evt: IncomePayloadFromModal) {
    if (evt?.amount && evt.amount > 0 && evt.date) {
      this.bumpBarSeries(evt.date, evt.amount, 'income'); // optimistic
    }
    this.incomes.push(evt);
    this.closeIncome();
    this.dash.invalidate();
    this.refreshDashboard();
  }

  // ===================== EXPENSE SAVE =====================
  onExpenseSave(evt: ExpensePayloadFromModal) {
    if (evt.amount == null || evt.amount <= 0) return;

    const payload = {
      description: evt.description?.trim() ?? '',
      amount: evt.amount as number,
      category: evt.category,
      date: evt.date,
      notes: evt.notes ?? '',
    };

    this.bumpBarSeries(payload.date, payload.amount, 'expense'); // optimistic

    const tempId = (globalThis as any).crypto?.randomUUID?.() ?? `tmp_${Date.now()}`;
    const optimistic = { ...payload, _id: tempId, _optimistic: true };
    this.expenses = [optimistic, ...this.expenses];
    this.rebuildPieFromLocal();

    this.expensesApi.addExpense(payload).subscribe({
      next: (created) => {
        this.expenses = [created ?? payload, ...this.expenses.filter((e) => e._id !== tempId)];
        this.rebuildPieFromLocal();
        this.closeExpense();
        this.dash.invalidate();
        this.refreshDashboard();
      },
      error: (err) => {
        this.expenses = this.expenses.filter((e) => e._id !== tempId);
        this.rebuildPieFromLocal();
        this.bumpBarSeries(payload.date, -payload.amount, 'expense'); // rollback
        console.error('Failed to save expense', err);
      },
    });
  }

  async ngAfterViewInit(): Promise<void> {
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
    this.refreshDashboard();
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  private destroyCharts() {
    this.barChart?.destroy();
    this.pieChart?.destroy();
    this.barChart = undefined;
    this.pieChart = undefined;
  }

  // ===================== DASHBOARD (server data) =====================
  private refreshDashboard(): void {
    // cards & pie
    this.dash.getDashboard(undefined, undefined, true).subscribe({
      next: (res: any) => {
        if (res?.cards) {
          this.cards.income.amount = res.cards.income?.amount ?? 0;
          this.cards.income.changePct = res.cards.income?.changePct ?? 0;
          this.cards.expenses.amount = res.cards.expenses?.amount ?? 0;
          this.cards.expenses.changePct = res.cards.expenses?.changePct ?? 0;
          this.cards.estimatedTaxDues = res.cards.estimatedTaxDues ?? 0;
          this.cards.savingsRatePct = res.cards.savingsRatePct ?? 0;
        }

        const apiBreakdown = res?.breakdown?.byCategory;
        if (Array.isArray(apiBreakdown) && apiBreakdown.length) {
          const labels = apiBreakdown.map((x: any) => x.category);
          const values = apiBreakdown.map((x: any) => Number(x.amount) || 0);
          this.upsertPie(labels, values);
        } else {
          this.rebuildPieFromLocal();
        }
      },
      error: () => this.rebuildPieFromLocal(),
    });

    // bar
    this.dash.getIncomeVsExpenses('month', true).subscribe({
      next: (res: any) => {
        const labels: string[] = res?.labels || [];
        const incomeRaw = res?.series?.find((s: any) => s.label === 'Income')?.data || [];
        const expenseRaw = res?.series?.find((s: any) => s.label === 'Expenses')?.data || [];

        const income = this.numberfy(incomeRaw, labels.length);
        const expense = this.numberfy(expenseRaw, labels.length);

        if (!labels.length) console.warn('[bar] empty labels from API');
        console.debug('[bar] labels:', labels, 'income:', income, 'expense:', expense);

        this.upsertBar(labels, income, expense);
      },
      error: (err) => console.error('Failed to load bar series', err),
    });
  }

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

    const apiHasBars = L > 0 && (incomeFixed.some(v => v > 0) || expensesFixed.some(v => v > 0));
    const useLabels   = apiHasBars ? labels         : ['Week 1','Week 2','Week 3','Week 4'];
    const useIncome   = apiHasBars ? incomeFixed    : [1200, 900, 1100, 1400];
    const useExpenses = apiHasBars ? expensesFixed  : [ 800, 700,  950,  600];

    if (this.barChart) {
      this.barChart.data.labels = useLabels;
      (this.barChart.data.datasets[0].data as number[]) = useIncome;
      (this.barChart.data.datasets[1].data as number[]) = useExpenses;
      this.barChart.update();
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
          x: {
            grid:   { display: false },
            border: { display: false },
            ticks:  { maxRotation: 0, autoSkip: true }
          },
          y: {
            beginAtZero: true,
            grid:   { display: true },
            border: { display: false }
          }
        },
        plugins: {
          legend:  { display: true, position: 'top' },
          tooltip: { enabled: true }
        }
      }
    });
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
      data: {
        labels,
        datasets: [
          { data, backgroundColor: ['#656ED3', '#25295A', '#8B95F9', '#A1A6D3', '#93A5CF', '#B8C6DB'] }
        ],
      },
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

  // ===================== OPTIMISTIC BAR PATCHER =====================
  private bumpBarSeries(dateISO: string, delta: number, kind: 'income' | 'expense') {
    if (!this.barChart || !dateISO || !isFinite(delta)) return;

    const labels = (this.barChart.data.labels || []) as (string | number)[];
    const idx = this.findBarBucketIndex(dateISO, labels);
    if (idx < 0) return;

    const dsIndex = kind === 'income' ? 0 : 1;
    const ds = this.barChart.data.datasets[dsIndex];
    const arr = ds.data as number[];

    const curr = Number(arr[idx] ?? 0);
    arr[idx] = curr + delta;

    this.barChart.update();
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
