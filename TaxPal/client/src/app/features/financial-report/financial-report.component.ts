import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinancialReportService } from './financial-report.service';
import { HttpClient } from '@angular/common/http';
import { DarkModeService } from '../../core/services/dark-mode.service';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbar.component';

interface MonthlyReport {
  name: string;
  month: string;
  income: number;
  expenses: number;
  netIncome: number;
  transactions: number;
  avgSize: number;
  budgetUsage: number;
  budget: number;
  rating: 'Excellent' | 'Good';
}

interface QuarterlyReport {
  name: string;
  quarter: string;
  income: number;
  expenses: number;
  netIncome: number;
  transactions: number;
  avgSize: number;
  budgetUsage: number;
  budget: number;
  rating: 'Excellent' | 'Good';
}

type Report = MonthlyReport | QuarterlyReport;

@Component({
  selector: 'app-financial-report',
  templateUrl: './financial-report.component.html',
  styleUrls: ['./financial-report.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent]
})
export class FinancialReportComponent implements OnInit, OnDestroy {
  selectedYear = new Date().getFullYear();
  showQuarterly = false;
  monthlyReports: MonthlyReport[] = [];
  quarterlyReports: QuarterlyReport[] = [];
  reports: Report[] = [];
  years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  yearSummary = {
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    savingsRate: 0
  };

  yearlyReport = {
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    savingRate: 0
  };

  userId: string = '';
  isDarkMode = false;
  private darkModeSubscription: Subscription = new Subscription();

  constructor(private financialReportService: FinancialReportService, private http: HttpClient, private darkModeService: DarkModeService) {}

  ngOnInit(): void {
    this.darkModeSubscription = this.darkModeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
    this.userId = localStorage.getItem('user_id') || '';
    this.loadFinancialReport();
  }

  ngOnDestroy(): void {
    this.darkModeSubscription.unsubscribe();
  }

  loadFinancialReport(): void {
    if (this.userId) {
      this.financialReportService.getFinancialReport(this.userId, this.selectedYear).subscribe({
        next: (data: any) => {
          this.processReportData(data);
        },
        error: (error) => {
          console.error('Error loading financial report:', error);
          this.generateMockData(); // Fallback to mock data
        }
      });
    } else {
      this.generateMockData(); // Fallback if no user
    }
  }

  processReportData(data: any): void {
    // Assuming data structure from backend
    this.monthlyReports = data.monthlyReports || [];
    this.quarterlyReports = this.calculateQuarterlyReports(this.monthlyReports);
    this.reports = this.showQuarterly ? this.quarterlyReports : this.monthlyReports;
    this.yearSummary = data.yearSummary || this.yearSummary;
    this.yearlyReport = data.yearlyReport || this.yearlyReport;
  }

  generateMockData(): void {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    this.monthlyReports = months.map(month => ({
      name: month,
      month,
      income: Math.random() * 10000 + 5000,
      expenses: Math.random() * 7000 + 3000,
      netIncome: Math.random() * 4000 + 1000,
      transactions: Math.floor(Math.random() * 30) + 40,
      avgSize: Math.floor(Math.random() * 100) + 50,
      budgetUsage: Math.random() * 40 + 60,
      budget: 7500,
      rating: Math.random() > 0.3 ? 'Excellent' : 'Good'
    }));

    // Calculate quarterly reports from monthly data
    this.quarterlyReports = this.calculateQuarterlyReports(this.monthlyReports);
    this.reports = this.showQuarterly ? this.quarterlyReports : this.monthlyReports;

    // Update summaries with mock data
    this.yearSummary.totalIncome = this.monthlyReports.reduce((sum, m) => sum + m.income, 0);
    this.yearSummary.totalExpenses = this.monthlyReports.reduce((sum, m) => sum + m.expenses, 0);
    this.yearSummary.netSavings = this.yearSummary.totalIncome - this.yearSummary.totalExpenses;
    this.yearSummary.savingsRate = (this.yearSummary.netSavings / this.yearSummary.totalIncome) * 100;

    this.yearlyReport = { ...this.yearSummary, savingRate: this.yearSummary.savingsRate };
  }

  onYearSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedYear = parseInt(target.value, 10);
    this.loadFinancialReport();
  }

  toggleView(): void {
    this.showQuarterly = !this.showQuarterly;
    this.reports = this.showQuarterly ? this.quarterlyReports : this.monthlyReports;
  }

  calculateQuarterlyReports(monthlyReports: MonthlyReport[]): QuarterlyReport[] {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const quarterlyReports: QuarterlyReport[] = [];

    for (let q = 0; q < 4; q++) {
      const startMonth = q * 3;
      const endMonth = startMonth + 3;
      const quarterMonths = monthlyReports.slice(startMonth, endMonth);

      const totalIncome = quarterMonths.reduce((sum, m) => sum + m.income, 0);
      const totalExpenses = quarterMonths.reduce((sum, m) => sum + m.expenses, 0);
      const netIncome = totalIncome - totalExpenses;
      const totalTransactions = quarterMonths.reduce((sum, m) => sum + m.transactions, 0);
      const avgSize = totalTransactions > 0 ? (totalIncome + totalExpenses) / totalTransactions : 0;

      // Average budget usage across the quarter
      const avgBudgetUsage = quarterMonths.reduce((sum, m) => sum + m.budgetUsage, 0) / 3;
      const budget = quarterMonths[0]?.budget || 7500; // Use first month's budget as representative

      // Determine rating based on net income
      const rating = netIncome > 0 ? 'Excellent' : 'Good';

      quarterlyReports.push({
        name: quarters[q],
        quarter: quarters[q],
        income: totalIncome,
        expenses: totalExpenses,
        netIncome,
        transactions: totalTransactions,
        avgSize: Math.round(avgSize),
        budgetUsage: Math.round(avgBudgetUsage),
        budget,
        rating
      });
    }

    return quarterlyReports;
  }

  exportReport(format: 'pdf' | 'csv' | 'excel'): void {
    this.financialReportService.exportReport(this.selectedYear, format).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `financial-report-${this.selectedYear}.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error exporting report:', error);
      }
    });
  }
}
