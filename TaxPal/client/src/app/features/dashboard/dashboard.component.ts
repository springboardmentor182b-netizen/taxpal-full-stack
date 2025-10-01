import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { DashboardService, DashboardSummary, Transaction, ExpenseBreakdown, BudgetProgress, TaxEstimation } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DecimalPipe, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit, OnDestroy, OnInit {
  private pieChart: any = null;
  private barChart: any = null;

  // Dashboard data
  dashboardSummary: DashboardSummary = { totalIncome: 0, totalExpenses: 0, netBalance: 0 };
  recentTransactions: Transaction[] = [];
  expenseBreakdown: ExpenseBreakdown[] = [];
  budgetProgress: BudgetProgress[] = [];
  taxEstimation: TaxEstimation | null = null;

  // UI state
  loading = false;
  error: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    // Load all dashboard data
    this.dashboardService.getDashboardSummary().subscribe({
      next: (summary) => {
        this.dashboardSummary = summary;
        this.updateCharts(summary);
      },
      error: (err) => {
        this.error = 'Failed to load dashboard summary';
        console.error('Error fetching dashboard summary:', err);
      }
    });

    this.dashboardService.getRecentTransactions().subscribe({
      next: (transactions) => {
        this.recentTransactions = transactions;
      },
      error: (err) => {
        console.error('Error fetching recent transactions:', err);
      }
    });

    this.dashboardService.getExpenseBreakdown().subscribe({
      next: (breakdown) => {
        this.expenseBreakdown = breakdown;
        this.updatePieChart(breakdown);
      },
      error: (err) => {
        console.error('Error fetching expense breakdown:', err);
      }
    });

    this.dashboardService.getBudgetProgress().subscribe({
      next: (budget) => {
        this.budgetProgress = budget;
      },
      error: (err) => {
        console.error('Error fetching budget progress:', err);
      }
    });

    this.dashboardService.getTaxEstimation().subscribe({
      next: (tax) => {
        this.taxEstimation = tax;
      },
      error: (err) => {
        console.error('Error fetching tax estimation:', err);
      }
    });

    this.loading = false;
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  // 🔹 Update charts dynamically
  updateCharts(data: DashboardSummary): void {
    if (this.barChart) {
      this.barChart.data.datasets[0].data = [data.totalIncome];
      this.barChart.data.datasets[1].data = [data.totalExpenses];
      this.barChart.update();
    }
  }

  // 🔹 Update pie chart with expense breakdown
  updatePieChart(breakdown: ExpenseBreakdown[]): void {
    if (this.pieChart && breakdown.length > 0) {
      const labels = breakdown.map(item => item._id);
      const data = breakdown.map(item => item.total);

      this.pieChart.data.labels = labels;
      this.pieChart.data.datasets[0].data = data;
      this.pieChart.update();
    }
  }

  // 🔹 Get color for expense category
  getExpenseColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Office': 'var(--pie-blue)',
      'Software & Tools': 'var(--pie-light-blue)',
      'Marketing': 'var(--pie-teal)',
      'Travel': 'var(--pie-green)',
      'Meals': 'var(--pie-orange)',
      'Other': 'var(--pie-gray)'
    };
    return colors[category] || 'var(--pie-gray)';
  }

  // 🔹 Calculate percentage for expense breakdown
  getExpensePercentage(expense: ExpenseBreakdown): number {
    const total = this.expenseBreakdown.reduce((sum, e) => sum + e.total, 0);
    return total > 0 ? (expense.total / total) * 100 : 0;
  }

  ngAfterViewInit(): void {
    // Theme toggle (dark/light)
    const modeToggle = document.getElementById('modeToggle');
    const setModeIcon = () => {
      const iconEl = modeToggle?.querySelector('i');
      if (!iconEl) return;
      if (document.body.classList.contains('light-mode')) {
        iconEl.className = 'fa-solid fa-sun';
      } else {
        iconEl.className = 'fa-solid fa-moon';
      }
    };
    if (modeToggle) {
      modeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        setModeIcon();
      });
    }
    setModeIcon();

    // Charts: assume Chart.js is loaded globally (via CDN in index.html) or installed and exposed.
    try {
      const Chart = (window as any).Chart;
      const pieCtx = (document.getElementById('pieChart') as HTMLCanvasElement).getContext('2d');
      this.pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: ['Rent/Mortgage', 'Utilities', 'Groceries', 'Others'],
          datasets: [{
            data: [32, 20, 25, 23],
            backgroundColor: [
              getComputedStyle(document.documentElement).getPropertyValue('--pie-blue'),
              getComputedStyle(document.documentElement).getPropertyValue('--pie-light-blue'),
              getComputedStyle(document.documentElement).getPropertyValue('--pie-teal'),
              getComputedStyle(document.documentElement).getPropertyValue('--pie-green')
            ]
          }]
        },
        options: { plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false }
      });

      const barCtx = (document.getElementById('barChart') as HTMLCanvasElement).getContext('2d');
      this.barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            { label: 'Income', data: [8700, 7700, 9500, 5600, 8800, 7900], backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--graph-income') },
            { label: 'Expenses', data: [3200, 3100, 3900, 2800, 3500, 3000], backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--graph-expense') }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: true, labels: { color: getComputedStyle(document.documentElement).getPropertyValue('--muted') || '#9aa8b8' } } },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--muted') || '#9aa8b8' } },
            x: { grid: { color: 'transparent' }, ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--muted') || '#9aa8b8' } }
          }
        }
      });
    } catch (e) {
      console.warn('Chart initialization skipped — Chart.js not found globally. See README to add Chart.js.', e);
    }
  }

  ngOnDestroy(): void {
    try {
      if (this.pieChart) this.pieChart.destroy();
      if (this.barChart) this.barChart.destroy();
    } catch (e) { }
  }
}
