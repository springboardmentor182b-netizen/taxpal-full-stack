import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DashboardService } from '../../../services/dashboard.service';
import { IncomeForm } from '../../income/income-form/income-form';
import { ExpensesForm } from '../../expenses/expenses-form/expenses-form';
import { DashboardForm } from '../../dashboard-form/dashboard-form/dashboard-form';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, FormsModule, MatDialogModule, MatIconModule],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  dashboardLetters: string[] = 'Dashboard'.split('');
  sidebarActive = false;
  collapsed = false;

  monthlyIncome = 0;
  monthlyExpenses = 0;
  estimatedTax = 0;
  savingsRate = 0;

  transactions: any[] = [];

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Income', 'Expenses'],
    datasets: [{ label: 'Amount ($)', data: [0, 0], backgroundColor: ['#3f51b5', '#f44336'] }]
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, suggestedMax: 5000 } }
  };

  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Rent/Mortgage', 'Business Expenses', 'Utilities', 'Food', 'Other'],
    datasets: [{ data: [0, 0, 0, 0, 0], backgroundColor: ['#2196f3', '#ff9800', '#4caf50', '#e91e63', '#9c27b0'] }]
  };

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  };

  currentUser: { id: string, fullName: string, email: string } | null = null;
  userInitials = '';
  selectedPeriod: 'month' | 'quarter' | 'year' = 'month';

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    const userData = sessionStorage.getItem('current_user') || localStorage.getItem('current_user');
    if (!userData) {
      this.router.navigate(['/features/login']);
      return;
    }

    this.currentUser = JSON.parse(userData) as { id: string, fullName: string, email: string };
    this.setUserInitials(this.currentUser.fullName);

    this.loadDashboardData();
  }

  private setUserInitials(fullName: string) {
    const names = fullName.trim().split(' ');
    this.userInitials = names.length === 1
      ? names[0].charAt(0).toUpperCase()
      : names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  }

  private loadDashboardData() {
    if (!this.currentUser?.id) return console.error('No user ID!');

    this.dashboardService.getDashboard(this.currentUser.id).subscribe({
      next: res => {
        console.log('Dashboard response:', res);

        this.monthlyIncome = res.monthlyIncome ?? 0;
        this.monthlyExpenses = res.monthlyExpenses ?? 0;
        this.estimatedTax = res.estimatedTaxDue ?? 0;
        this.savingsRate = res.savingsRate ?? 0;

        this.transactions = res.transactions && res.transactions.length
          ? [...res.transactions]
          : [
              { date: new Date(), description: 'Salary', category: 'Income', amount: this.monthlyIncome, type: 'Credit' },
              { date: new Date(), description: 'Rent', category: 'Rent/Mortgage', amount: -200, type: 'Debit' },
              { date: new Date(), description: 'Groceries', category: 'Food', amount: -150, type: 'Debit' }
            ];

        this.updateCharts();
      },
      error: err => console.error('HTTP error:', err)
    });
  }

  toggleSidebar() { this.sidebarActive = !this.sidebarActive; }
  closeSidebarOverlay() { this.sidebarActive = false; }
  toggleCollapse() { this.collapsed = !this.collapsed; }

  openIncomeForm() {
    const dialogRef = this.dialog.open(IncomeForm, { width: '400px' });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) return;
      this.transactions.push({ ...res, type: 'Credit', amount: res.amount });
      this.updateCharts();
    });
  }

  openExpenseForm() {
    const dialogRef = this.dialog.open(ExpensesForm, { width: '400px' });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) return;
      this.transactions.push({ ...res, type: 'Debit', amount: -res.amount });
      this.updateCharts();
    });
  }

  updateCharts() {
    const now = new Date();
    let filteredTransactions = this.transactions;

    if (this.selectedPeriod === 'month') {
      filteredTransactions = filteredTransactions.filter(tx => {
        const d = new Date(tx.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    } else if (this.selectedPeriod === 'quarter') {
      const currentQuarter = Math.floor(now.getMonth() / 3);
      filteredTransactions = filteredTransactions.filter(tx =>
        Math.floor(new Date(tx.date).getMonth() / 3) === currentQuarter &&
        new Date(tx.date).getFullYear() === now.getFullYear()
      );
    } else if (this.selectedPeriod === 'year') {
      filteredTransactions = filteredTransactions.filter(tx => new Date(tx.date).getFullYear() === now.getFullYear());
    }

    const totalIncome = filteredTransactions.filter(tx => tx.type === 'Credit').reduce((sum, tx) => sum + tx.amount, 0);
    const totalExpenses = filteredTransactions.filter(tx => tx.type === 'Debit').reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    this.monthlyIncome = totalIncome;
    this.monthlyExpenses = totalExpenses;
    this.savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    // Update Bar Chart
    this.barChartData = {
      ...this.barChartData,
      datasets: [{ ...this.barChartData.datasets[0], data: [totalIncome, totalExpenses] }]
    };

    // Update Pie Chart
    const categories = ['Rent/Mortgage', 'Business Expenses', 'Utilities', 'Food', 'Other'];
    const categoryData = categories.map(cat =>
      filteredTransactions.filter(tx => tx.category === cat && tx.type === 'Debit')
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)
    );
    const totalCatExpenses = categoryData.reduce((a, b) => a + b, 0);
    this.pieChartData = {
      labels: categories,
      datasets: [{
        data: categoryData.map(d => totalCatExpenses ? Math.round(d / totalCatExpenses * 100) : 0),
        backgroundColor: ['#2196f3', '#ff9800', '#4caf50', '#e91e63', '#9c27b0']
      }]
    };

    // Refresh transactions array reference
    this.transactions = [...filteredTransactions];
  }

  onPeriodChange(period: 'month' | 'quarter' | 'year') {
    this.selectedPeriod = period;
    this.updateCharts();
  }

  openDashboardForm() {
    const dialogRef = this.dialog.open(DashboardForm, {
      width: '600px',
      data: {
        monthlyIncome: this.monthlyIncome,
        monthlyExpenses: this.monthlyExpenses,
        estimatedTaxDue: this.estimatedTax,
        savingsRate: this.savingsRate,
        transactions: [...this.transactions]
      }
    });

    dialogRef.afterClosed().subscribe(updatedData => {
      if (!updatedData) return;

      if (!this.currentUser?.id) return console.error('No user ID!');

      const payload = {
        ...updatedData,
        transactions: [...updatedData.transactions]
      };

      this.dashboardService.upsertDashboard(this.currentUser.id, payload).subscribe({
        next: res => {
          console.log('Dashboard updated:', res);

          this.transactions = res.transactions ?? updatedData.transactions;
          this.monthlyIncome = res.monthlyIncome ?? this.monthlyIncome;
          this.monthlyExpenses = res.monthlyExpenses ?? this.monthlyExpenses;
          this.estimatedTax = res.estimatedTaxDue ?? this.estimatedTax;
          this.savingsRate = res.savingsRate ?? this.savingsRate;

          this.updateCharts();
          this.loadDashboardData();
        },
        error: err => console.error('Update failed:', err)
      });
    });
  }

  trackByIndex(index: number): number {
    return index;
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/features/login']);
  }
}
