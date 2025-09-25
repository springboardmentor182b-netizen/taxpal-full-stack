import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DashboardService } from '../../../services/dashboard.service';
import { IncomeForm } from '../../income/income-form/income-form.component';
import { ExpensesForm } from '../../expenses/expenses-form/expenses-form.component';
import { DashboardForm } from '../../dashboard-form/dashboard-form/dashboard-form.component';
import { RouterModule } from '@angular/router'; 
@Component({
  selector: 'app-dashboard',
  standalone: true,
   
  imports: [CommonModule, BaseChartDirective, FormsModule, MatDialogModule, MatIconModule, RouterModule,],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
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
  showAllTransactions = false; // for View All toggle

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
        this.monthlyIncome = res.monthlyIncome ?? 0;
        this.monthlyExpenses = res.monthlyExpenses ?? 0;
        this.estimatedTax = res.estimatedTaxDue ?? 0;
        this.savingsRate = res.savingsRate ?? 0;

        this.transactions = Array.isArray(res.transactions) ? res.transactions : [];

        // normalize transactions
        this.transactions = this.transactions.map(tx => ({
          ...tx,
          category: tx.category?.trim() || 'Other',
          amount: tx.amount ?? 0,
          type: tx.type ?? 'Debit'
        }));

        this.updateCharts();
      },
      error: err => console.error('HTTP error:', err)
    });
  }

  toggleSidebar() { this.sidebarActive = !this.sidebarActive; }
  closeSidebarOverlay() { this.sidebarActive = false; }
  toggleCollapse() { this.collapsed = !this.collapsed; }

  // Recent transactions getter
  get recentTransactions() {
    const sorted = [...this.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return this.showAllTransactions ? sorted : sorted.slice(0, 5);
  }

  toggleShowAllTransactions() {
    this.showAllTransactions = !this.showAllTransactions;
  }

  openIncomeForm() {
    const dialogRef = this.dialog.open(IncomeForm, { width: '400px' });
    dialogRef.afterClosed().subscribe(res => {
      if (!res || !this.currentUser?.id) return;
  
      const newIncome = { ...res, type: 'Income', amount: res.amount, date: res.date || new Date() };
      this.transactions.push(newIncome);
      this.updateCharts(); // <-- totals updated immediately
  
      // Send transactions to backend (optional, async)
      this.dashboardService.upsertDashboard(this.currentUser.id, { transactions: this.transactions }).subscribe({
        next: updatedRes => console.log('Income saved'),
        error: err => console.error('Failed to save income:', err)
      });
    });
  }
  
  openExpenseForm() {
    const dialogRef = this.dialog.open(ExpensesForm, { width: '400px' });
    dialogRef.afterClosed().subscribe(res => {
      if (!res || !this.currentUser?.id) return;
  
      const newExpense = { ...res, type: 'Expense', amount: res.amount, date: res.date || new Date() };
      this.transactions.push(newExpense);
      this.updateCharts(); // <-- totals updated immediately
  
      this.dashboardService.upsertDashboard(this.currentUser.id, { transactions: this.transactions }).subscribe({
        next: updatedRes => console.log('Expense saved'),
        error: err => console.error('Failed to save expense:', err)
      });
    });
  }
  
  // openExpenseForm() {
  //   const dialogRef = this.dialog.open(ExpensesForm, { width: '400px' });
  //   dialogRef.afterClosed().subscribe(res => {
  //     if (!res || !this.currentUser?.id) return;

  //     const newExpense = { ...res, type: 'Expense', amount: res.amount };
  //     this.transactions.push(newExpense);
  //     this.updateCharts();

  //     this.dashboardService.upsertDashboard(this.currentUser.id, { transactions: this.transactions }).subscribe({
  //       next: updatedRes => {
  //         this.monthlyIncome = updatedRes.monthlyIncome ?? 0;
  //         this.monthlyExpenses = updatedRes.monthlyExpenses ?? 0;
  //         this.estimatedTax = updatedRes.estimatedTaxDue ?? 0;
  //         this.savingsRate = updatedRes.savingsRate ?? 0;
  //         this.transactions = updatedRes.transactions ?? [];
  //         this.updateCharts();
  //       },
  //       error: err => console.error('Failed to save expense:', err)
  //     });
  //   });
  // }

  updateCharts() {
    const now = new Date();
  
    // Filter transactions for the selected period
    const filteredTransactions = this.transactions.filter(tx => {
      const d = new Date(tx.date);
      if (this.selectedPeriod === 'month')
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      if (this.selectedPeriod === 'quarter')
        return Math.floor(d.getMonth() / 3) === Math.floor(now.getMonth() / 3) && d.getFullYear() === now.getFullYear();
      return d.getFullYear() === now.getFullYear();
    });
  
    // Compute totals from filtered transactions
    this.monthlyIncome = filteredTransactions
      .filter(tx => tx.type === 'Income')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  
    this.monthlyExpenses = filteredTransactions
      .filter(tx => tx.type === 'Expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  
    // Update bar chart
    this.barChartData = {
      ...this.barChartData,
      datasets: [{ ...this.barChartData.datasets[0], data: [this.monthlyIncome, this.monthlyExpenses] }]
    };
  
    // Update pie chart (expense categories)
    const expenseTransactions = filteredTransactions.filter(tx => tx.type === 'Expense');
    const categoryMap: Record<string, number> = {};
    expenseTransactions.forEach(tx => {
      const cat = tx.category?.trim() || 'Other';
      categoryMap[cat] = (categoryMap[cat] || 0) + (tx.amount || 0);
    });
  
    let categories = Object.keys(categoryMap);
    let categoryData = Object.values(categoryMap);
    const totalExpense = categoryData.reduce((a, b) => a + b, 0);
  
    if (categories.length === 0) {
      categories = ['No Expenses'];
      categoryData = [100];
    } else {
      categoryData = categoryData.map(val => (val / totalExpense) * 100); // convert to %
    }
  
    const defaultColors = ['#2196f3', '#ff9800', '#4caf50', '#e91e63', '#9c27b0', '#00bcd4', '#ffc107'];
    const bgColors = categories.map((_, i) => defaultColors[i % defaultColors.length]);
  
    this.pieChartData = {
      labels: categories,
      datasets: [{ ...this.pieChartData.datasets[0], data: categoryData, backgroundColor: bgColors }]
    };
  
    // Update savings rate
    this.savingsRate = this.monthlyIncome
      ? ((this.monthlyIncome - this.monthlyExpenses) / this.monthlyIncome) * 100
      : 0;
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
      if (!updatedData || !this.currentUser?.id) return;

      const payload = {
        monthlyIncome: updatedData.monthlyIncome ?? this.monthlyIncome,
        monthlyExpenses: updatedData.monthlyExpenses ?? this.monthlyExpenses,
        estimatedTaxDue: updatedData.estimatedTaxDue ?? this.estimatedTax,
        savingsRate: updatedData.savingsRate ?? this.savingsRate,
        transactions: updatedData.transactions?.length ? updatedData.transactions : this.transactions
      };

      this.dashboardService.upsertDashboard(this.currentUser.id, payload).subscribe({
        next: res => {
          this.monthlyIncome = res.monthlyIncome ?? this.monthlyIncome;
          this.monthlyExpenses = res.monthlyExpenses ?? this.monthlyExpenses;
          this.estimatedTax = res.estimatedTaxDue ?? this.estimatedTax;
          this.savingsRate = res.savingsRate ?? this.savingsRate;
          this.transactions = res.transactions?.length ? res.transactions : this.transactions;
          this.updateCharts();
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
