import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IncomeForm } from '../../income/income-form/income-form';
import { ExpensesForm } from '../../expenses/expenses-form/expenses-form';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    MatDialogModule
  ],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard {
  sidebarActive = false;
  collapsed = false;
  monthlyIncome = 4200;
  monthlyExpenses = 2750;
  estimatedTax = 650;
  savingsRate = ((this.monthlyIncome - this.monthlyExpenses) / this.monthlyIncome) * 100;

  transactions = [
    { date: '2025-09-01', description: 'Salary Payment', category: 'Income', amount: 4200, type: 'Credit' },
    { date: '2025-09-03', description: 'Rent', category: 'Housing', amount: -1200, type: 'Debit' },
    { date: '2025-09-05', description: 'Groceries', category: 'Food', amount: -200, type: 'Debit' },
    { date: '2025-09-10', description: 'Utilities', category: 'Bills', amount: -150, type: 'Debit' },
    { date: '2025-09-12', description: 'Freelance Work', category: 'Income', amount: 800, type: 'Credit' },
  ];

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Income', 'Expenses'],
    datasets: [{ label: 'Amount ($)', data: [this.monthlyIncome, this.monthlyExpenses], backgroundColor: ['#3f51b5', '#f44336'] }]
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = { responsive: true, plugins: { legend: { display: false } } };

  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Rent/Mortgage', 'Business Expenses', 'Utilities', 'Food', 'Other'],
    datasets: [{ data: [32, 28, 17, 12, 11], backgroundColor: ['#2196f3', '#ff9800', '#4caf50', '#e91e63', '#9c27b0'] }]
  };

  pieChartOptions: ChartConfiguration<'pie'>['options'] = { responsive: true, plugins: { legend: { display: false } } };

  constructor(private dialog: MatDialog) {}

  // Sidebar toggles
  toggleSidebar() { this.sidebarActive = !this.sidebarActive; }
  closeSidebarOverlay() { this.sidebarActive = false; }
  toggleCollapse() { this.collapsed = !this.collapsed; }

  // Open Income dialog
  openIncomeForm() {
    const dialogRef = this.dialog.open(IncomeForm, { width: '400px' });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        console.log('Income added:', res);
        this.transactions.push({
          date: res.date,
          description: res.description,
          category: res.category,
          amount: res.amount,
          type: 'Credit'
        });
        this.updateCharts();
      }
    });
  }

  // Open Expense dialog
  openExpenseForm() {
    const dialogRef = this.dialog.open(ExpensesForm, { width: '400px' });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        console.log('Expense added:', res);
        this.transactions.push({
          date: res.date,
          description: res.description,
          category: res.category,
          amount: -res.amount,
          type: 'Debit'
        });
        this.updateCharts();
      }
    });
  }

  // Update bar chart after adding new transactions
  updateCharts() {
    const totalIncome = this.transactions
      .filter(tx => tx.type === 'Credit')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const totalExpenses = this.transactions
      .filter(tx => tx.type === 'Debit')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    this.barChartData.datasets[0].data = [totalIncome, totalExpenses];
    this.savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
  }
}
