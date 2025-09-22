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
        console.log('Transactions from backend:', res.transactions);
  
        // Use backend values or fallback to 0
        this.monthlyIncome = res.monthlyIncome ?? 0;
        this.monthlyExpenses = res.monthlyExpenses ?? 0;
        this.estimatedTax = res.estimatedTaxDue ?? 0;
        this.savingsRate = res.savingsRate ?? 0;
  
        // Ensure transactions array exists
        this.transactions = Array.isArray(res.transactions) ? res.transactions : [];
  
        // Make sure every transaction has a category (for pie chart)
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

  openIncomeForm() {
    const dialogRef = this.dialog.open(IncomeForm, { width: '400px' });
    dialogRef.afterClosed().subscribe(res => {
      if (!res || !this.currentUser?.id) return;
  
      // 1️⃣ Add new income transaction to local array
      const newIncome = { ...res, type: 'Credit', amount: res.amount };
      this.transactions.push(newIncome);
  
      // 2️⃣ Update monthlyIncome locally
      this.monthlyIncome += res.amount;
  
      // 3️⃣ Update charts immediately
      this.updateCharts();
  
      // 4️⃣ Persist to backend
      const payload = {
        monthlyIncome: this.monthlyIncome,
        monthlyExpenses: this.monthlyExpenses,
        estimatedTaxDue: this.estimatedTax,
        savingsRate: this.savingsRate,
        transactions: this.transactions
      };
  
      this.dashboardService.upsertDashboard(this.currentUser.id, payload).subscribe({
        next: updatedRes => {
          console.log('Income saved to backend:', updatedRes);
        },
        error: err => console.error('Failed to save income:', err)
      });
    });
  }
  
  
  
  openExpenseForm() {
    const dialogRef = this.dialog.open(ExpensesForm, { width: '400px' });
    dialogRef.afterClosed().subscribe(res => {
      if (!res || !this.currentUser?.id) return;
  
      const newExpense = { ...res, type: 'Debit', amount: res.amount };
      this.transactions.push(newExpense);
  
      // Update monthlyExpenses locally
      this.monthlyExpenses += res.amount;
  
      // Update charts immediately
      this.updateCharts();
  
      // Persist to backend
      const payload = {
        monthlyIncome: this.monthlyIncome,
        monthlyExpenses: this.monthlyExpenses,
        estimatedTaxDue: this.estimatedTax,
        savingsRate: this.savingsRate,
        transactions: this.transactions
      };
  
      this.dashboardService.upsertDashboard(this.currentUser.id, payload).subscribe({
        next: updatedRes => {
          console.log('Expense saved to backend:', updatedRes);
        },
        error: err => console.error('Failed to save expense:', err)
      });
    });
  }
  
  
  

  updateCharts() {
    const now = new Date();
  
    // Filter transactions based on selected period (for pie chart)
    let filteredTransactions = this.transactions.filter(tx => {
      const d = new Date(tx.date);
      if (this.selectedPeriod === 'month') {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      } else if (this.selectedPeriod === 'quarter') {
        const currentQuarter = Math.floor(now.getMonth() / 3);
        return Math.floor(d.getMonth() / 3) === currentQuarter && d.getFullYear() === now.getFullYear();
      } else { // year
        return d.getFullYear() === now.getFullYear();
      }
    });
  
    // --- Bar chart uses monthlyIncome / monthlyExpenses directly ---
    this.barChartData = {
      ...this.barChartData,
      datasets: [{
        ...this.barChartData.datasets[0],
        data: [this.monthlyIncome, this.monthlyExpenses]
      }]
    };
  
    // --- Pie chart: dynamic expense categories ---
    const expenseTransactions = filteredTransactions.filter(tx => tx.type === 'Debit');
    const categoryMap: Record<string, number> = {};
  
    expenseTransactions.forEach(tx => {
      const cat = tx.category || 'Other';
      categoryMap[cat] = (categoryMap[cat] || 0) + tx.amount;
    });
  
    let categories = Object.keys(categoryMap);
    let categoryData = Object.values(categoryMap);
  
    if (categories.length === 0) {
      categories = ['No Expenses'];
      categoryData = [1];
    }
  
    const defaultColors = ['#2196f3', '#ff9800', '#4caf50', '#e91e63', '#9c27b0', '#00bcd4', '#ffc107'];
    const bgColors = categories.map((_, i) => defaultColors[i % defaultColors.length]);
  
    this.pieChartData = {
      labels: categories,
      datasets: [{
        ...this.pieChartData.datasets[0],
        data: categoryData,
        backgroundColor: bgColors
      }]
    };
  
    // --- Savings rate ---
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
        transactions: [...this.transactions] // pass current transactions
      }
    });
  
    dialogRef.afterClosed().subscribe(updatedData => {
      if (!updatedData) return;
      if (!this.currentUser?.id) return console.error('No user ID!');
  
      // Merge updated data with existing dashboard values
      const payload = {
        monthlyIncome: updatedData.monthlyIncome ?? this.monthlyIncome,
        monthlyExpenses: updatedData.monthlyExpenses ?? this.monthlyExpenses,
        estimatedTaxDue: updatedData.estimatedTaxDue ?? this.estimatedTax,
        savingsRate: updatedData.savingsRate ?? this.savingsRate,
        // Ensure we merge transactions correctly: either new edited transactions or keep existing
        transactions: updatedData.transactions?.length
          ? updatedData.transactions
          : this.transactions
      };
  
      this.dashboardService.upsertDashboard(this.currentUser.id, payload).subscribe({
        next: res => {
          console.log('Dashboard updated:', res);
  
          // Update UI fields from backend response
          this.monthlyIncome = res.monthlyIncome ?? this.monthlyIncome;
          this.monthlyExpenses = res.monthlyExpenses ?? this.monthlyExpenses;
          this.estimatedTax = res.estimatedTaxDue ?? this.estimatedTax;
          this.savingsRate = res.savingsRate ?? this.savingsRate;
          this.transactions = res.transactions?.length ? res.transactions : this.transactions;
  
          // Refresh charts after updating data
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



// Update bar chart after adding new transactions



}
