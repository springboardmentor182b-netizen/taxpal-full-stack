import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart, { Chart as ChartType } from 'chart.js/auto';
import { HttpClientModule } from '@angular/common/http';

import { IncomeModalComponent } from '../../auth/components/income/income';
import { ExpenseModalComponent } from '../../auth/components/expense/expense';
import { DashboardService } from '../../dashboard/service/dashboard.service';
import { ExpenseService } from '../../../core/services/expense.service';
import { TransactionService, Transaction } from '../../../core/services/transaction.service'; // <-- adjust path if needed

type IncomePayloadFromModal = {
  description: string;
  amount: number | null;
  category: string;
  date: string;  // yyyy-mm-dd
  notes: string;
};

type ExpensePayloadFromModal = {
  description: string;
  amount: number | null;
  category: string;
  date: string;  // yyyy-mm-dd
  notes: string;
};

// Display model for the Recent Transactions table
type TxTypeDisplay = 'Income' | 'Expense';
interface TxRow {
  id: string;
  date: Date;
  description: string;
  category: string;
  amount: number; // original unsigned
  signed: number; // + for income, - for expense
  type: TxTypeDisplay;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, IncomeModalComponent, ExpenseModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  showIncome = false;
  showExpense = false;

  incomes: any[] = [];
  expenses: any[] = [];

  // ---- Recent Transactions state
  recentTxns: TxRow[] = [];
  loadingRecent = false;
  readonly RECENT_LIMIT = 8;

  cards = {
    income: { amount: 0, changePct: 0 },
    expenses: { amount: 0, changePct: 0 },
    estimatedTaxDues: 0,
    savingsRatePct: 0
  };

  private barChart?: ChartType;
  private pieChart?: ChartType;

  constructor(
    private dash: DashboardService,
    private expensesApi: ExpenseService,
    private txSvc: TransactionService
  ) {}

  openIncome()  { this.showIncome = true; }
  openExpense() { this.showExpense = true; }
  closeIncome() { this.showIncome = false; }
  closeExpense(){ this.showExpense = false; }

  // ===================== INCOME SAVE =====================
  onIncomeSave(evt: IncomePayloadFromModal) {
    if (evt?.amount && evt.amount > 0 && evt.date) {
      // Optimistic bump so the bar chart updates immediately
      this.bumpBarSeries(evt.date, evt.amount, 'income');
    }

    this.incomes.push(evt);
    this.closeIncome();
    this.dash.invalidate();
    this.refreshDashboard();       // authoritative fetch (keeps chart correct)
    this.loadRecentTransactions(); // refresh recent after save
  }

  // ===================== EXPENSE SAVE =====================
  /** Save expense -> POST via service -> optimistic add -> replace/rollback on response */
  onExpenseSave(evt: ExpensePayloadFromModal) {
    if (evt.amount == null || evt.amount <= 0) return;

    const payload = {
      description: evt.description?.trim() ?? '',
      amount: evt.amount as number,
      category: evt.category,
      date: evt.date,
      notes: evt.notes ?? ''
    };

    // Optimistic bar bump (so Income vs Expenses reacts instantly)
    this.bumpBarSeries(payload.date, payload.amount, 'expense');

    // Optimistic update so the pie updates instantly
    const tempId = (globalThis as any).crypto?.randomUUID?.() ?? `tmp_${Date.now()}`;
    const optimistic = { ...payload, _id: tempId, _optimistic: true };
    this.expenses = [optimistic, ...this.expenses];
    this.rebuildPieFromLocal();

    this.expensesApi.addExpense(payload).subscribe({
      next: (created) => {
        // Replace optimistic item with the server-created one
        this.expenses = [created ?? payload, ...this.expenses.filter(e => e._id !== tempId)];
        this.rebuildPieFromLocal();
        this.closeExpense();
        this.dash.invalidate();
        this.refreshDashboard();       // authoritative fetch for bar + cards
        this.loadRecentTransactions(); // refresh recent after save
      },
      error: (err) => {
        // Roll back optimistic changes
        this.expenses = this.expenses.filter(e => e._id !== tempId);
        this.rebuildPieFromLocal();
        this.bumpBarSeries(payload.date, -payload.amount, 'expense');
        console.error('Failed to save expense', err);
      }
    });
  }

  ngAfterViewInit(): void {
    this.refreshDashboard();
    this.loadRecentTransactions(); // initial load of recent transactions
  }

  ngOnDestroy(): void {
    this.barChart?.destroy();
    this.pieChart?.destroy();
  }

  // ===================== RECENT TRANSACTIONS =====================
  private loadRecentTransactions(): void {
    this.loadingRecent = true;
    this.txSvc.getRecentTransactions(this.RECENT_LIMIT).subscribe({
      next: (list: Transaction[]) => {
        // Map API objects to display rows (capitalize type + signed amount)
        this.recentTxns = list.map((t) => ({
          id: t._id,
          date: t.date instanceof Date ? t.date : new Date(t.date),
          description: t.description || (t.type === 'income' ? 'Income' : 'Expense'),
          category: t.category || 'General',
          amount: t.amount,
          signed: t.type === 'income' ? t.amount : -Math.abs(t.amount),
          type: t.type === 'income' ? 'Income' : 'Expense',
        }));
        this.loadingRecent = false;
      },
      error: (err) => {
        console.error('Failed to load recent transactions', err);
        this.recentTxns = [];
        this.loadingRecent = false;
      }
    });
  }

  trackByTxId = (_: number, tx: TxRow) => tx.id;

  // ===================== DASHBOARD (existing) =====================
  private refreshDashboard(): void {
    this.dash.getDashboard(undefined, undefined, true).subscribe({
      next: (res: any) => {
        if (res?.cards) {
          this.cards.income.amount       = res.cards.income?.amount ?? 0;
          this.cards.income.changePct    = res.cards.income?.changePct ?? 0;
          this.cards.expenses.amount     = res.cards.expenses?.amount ?? 0;
          this.cards.expenses.changePct  = res.cards.expenses?.changePct ?? 0;
          this.cards.estimatedTaxDues    = res.cards.estimatedTaxDues ?? 0;
          this.cards.savingsRatePct      = res.cards.savingsRatePct ?? 0;
        }

        const apiBreakdown = res?.breakdown?.byCategory;
        if (Array.isArray(apiBreakdown) && apiBreakdown.length) {
          const labels = apiBreakdown.map((x: any) => x.category);
          const values = apiBreakdown.map((x: any) => x.amount);
          this.upsertPie(labels, values);
        } else {
          this.rebuildPieFromLocal();
        }
      },
      error: () => this.rebuildPieFromLocal()
    });

    this.dash.getIncomeVsExpenses('month', true).subscribe({
      next: (res: any) => {
        const labels = res?.labels || [];
        const income = (res?.series?.find((s: any) => s.label === 'Income')?.data) || [];
        const expense = (res?.series?.find((s: any) => s.label === 'Expenses')?.data) || [];
        this.upsertBar(labels, income, expense);
      },
      error: (err) => console.error('Failed to load bar series', err)
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
    const values = labels.map(l => totals[l]);
    this.upsertPie(labels, values);
  }

  private upsertBar(labels: string[], income: number[], expenses: number[]) {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement | null;
    if (!ctx) return;

    if (this.barChart) {
      this.barChart.data.labels = labels;
      (this.barChart.data.datasets[0].data as number[]) = income;
      (this.barChart.data.datasets[1].data as number[]) = expenses;
      this.barChart.update();
      return;
    }

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Income',   data: income,   backgroundColor: '#656ED3' },
          { label: 'Expenses', data: expenses, backgroundColor: '#25295A' }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
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

    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{ data, backgroundColor: ['#656ED3','#25295A','#8B95F9','#A1A6D3','#93A5CF','#B8C6DB'] }]
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
              }
            }
          }
        }
      }
    });
  }

  // ===================== OPTIMISTIC BAR PATCHER =====================
  /** Adds `delta` to the correct bar bucket for the given date and type (income/expense). */
  private bumpBarSeries(dateISO: string, delta: number, kind: 'income' | 'expense') {
    if (!this.barChart || !dateISO || !isFinite(delta)) return;

    const labels = (this.barChart.data.labels || []) as (string | number)[];
    const idx = this.findBarBucketIndex(dateISO, labels);
    if (idx < 0) return; // bucket not visible; server refresh will correct later

    // dataset[0] = Income, dataset[1] = Expenses (as per upsertBar)
    const dsIndex = kind === 'income' ? 0 : 1;
    const ds = this.barChart.data.datasets[dsIndex];
    const arr = (ds.data as number[]);

    const curr = Number(arr[idx] ?? 0);
    arr[idx] = curr + delta;

    this.barChart.update();
  }

  /** Tries to find the label bucket index for a given day; tolerant to 'Sep/Sept' variations. */
  private findBarBucketIndex(dateISO: string, labels: (string | number)[]): number {
    const d = new Date(dateISO);
    if (isNaN(d.getTime())) return -1;

    const dd = `${d.getDate()}`.padStart(2, '0'); // '01'
    const short = d.toLocaleString(undefined, { month: 'short' }); // 'Sep'/'Sept' depending on locale

    const candidates = [
      `${dd} ${short}`,
      `${dd} ${short}.`,
      `${dd} ${short.replace('Sept', 'Sep')}`,
      `${dd} ${short.replace('Sep', 'Sept')}`,
    ];

    for (const c of candidates) {
      const i = labels.findIndex(l => String(l) === c);
      if (i >= 0) return i;
    }

    // very loose fallback (works if chart shows only one month)
    return labels.findIndex(l => String(l).startsWith(dd + ' '));
  }
}
