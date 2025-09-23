import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart, { Chart as ChartType } from 'chart.js/auto';
import { HttpClientModule } from '@angular/common/http';

import { IncomeModalComponent } from '../../auth/components/income/income';
import { ExpenseModalComponent } from '../../auth/components/expense/expense';
import { DashboardService } from '../../dashboard/service/dashboard.service';

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

  // card values (optional UI bindings)
  cards = {
    income: { amount: 0, changePct: 0 },
    expenses: { amount: 0, changePct: 0 },
    estimatedTaxDues: 0,
    savingsRatePct: 0
  };

  private barChart?: ChartType;
  private pieChart?: ChartType;

  constructor(private dash: DashboardService) {}

  openIncome()  { this.showIncome = true; }
  openExpense() { this.showExpense = true; }
  closeIncome() { this.showIncome = false; }
  closeExpense(){ this.showExpense = false; }

  onIncomeSave(data: any) {
    // (Assuming your modal already did a POST to /incomes)
    this.incomes.push(data);
    this.closeIncome();
    this.refreshDashboard();
  }

  onExpenseSave(data: any) {
    // (Assuming your modal already did a POST to /expenses)
    this.expenses.push(data);
    this.closeExpense();
    this.refreshDashboard();
  }

  ngAfterViewInit(): void {
    this.refreshDashboard(); // initial load
  }

  ngOnDestroy(): void {
    this.barChart?.destroy();
    this.pieChart?.destroy();
  }

  private refreshDashboard(): void {
    // 1) Summary + pie breakdown
    this.dash.getDashboard().subscribe(res => {
      // update cards
      if (res.cards) {
        this.cards.income.amount       = res.cards.income?.amount ?? 0;
        this.cards.income.changePct    = res.cards.income?.changePct ?? 0;
        this.cards.expenses.amount     = res.cards.expenses?.amount ?? 0;
        this.cards.expenses.changePct  = res.cards.expenses?.changePct ?? 0;
        this.cards.estimatedTaxDues    = res.cards.estimatedTaxDues ?? 0;
        this.cards.savingsRatePct      = res.cards.savingsRatePct ?? 0;
      }

      // update pie (category breakdown)
      const labels = (res.breakdown?.byCategory || []).map((x: any) => x.category);
      const values = (res.breakdown?.byCategory || []).map((x: any) => x.amount);
      this.upsertPie(labels, values);
    });

    // 2) Income vs Expenses (bar)
    this.dash.getIncomeVsExpenses('month').subscribe(res => {
      const labels = res.labels || [];
      const income = (res.series?.find((s: any) => s.label === 'Income')?.data) || [];
      const expense = (res.series?.find((s: any) => s.label === 'Expenses')?.data) || [];
      this.upsertBar(labels, income, expense);
    });
  }

  private upsertBar(labels: string[], income: number[], expenses: number[]) {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
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
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
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
        datasets: [{ data, backgroundColor: ['#656ED3', '#25295A', '#8B95F9', '#A1A6D3', '#93A5CF', '#B8C6DB'] }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }
    });
  }
}
