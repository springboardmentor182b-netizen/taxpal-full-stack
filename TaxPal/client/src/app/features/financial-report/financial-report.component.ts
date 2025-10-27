import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinancialReportService } from './financial-report.service';
import { HttpClient } from '@angular/common/http';
import { DarkModeService } from '../../core/services/dark-mode.service';
import { Subscription } from 'rxjs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
  imports: [CommonModule, FormsModule]
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

  // Add new properties for preview functionality
  showPreview = false;
  previewData: any = null;
  isGeneratingPreview = false;
  previewFormat: 'pdf' | 'csv' | 'excel' = 'pdf';

  // Add new property for report type
  selectedReportType: 'income' | 'expense' | 'summary' = 'summary';

  // New properties for user profile
  userName: string = '';
  userEmail: string = '';
  userInitial: string = '';
  showProfileMenu: boolean = false;

  constructor(private financialReportService: FinancialReportService, private http: HttpClient, private darkModeService: DarkModeService) {}

  ngOnInit(): void {
    this.darkModeSubscription = this.darkModeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
    this.userId = localStorage.getItem('user_id') || '';
    this.userName = localStorage.getItem('user_name') || '';
    this.userEmail = localStorage.getItem('user_email') || '';
    this.userInitial = this.userName ? this.userName.charAt(0).toUpperCase() : (this.userEmail.charAt(0).toUpperCase() || 'U');
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

  // Modify exportReport method to fetch data first
  exportReport(format: 'pdf' | 'csv' | 'excel'): void {
    this.isGeneratingPreview = true;
    this.previewFormat = format;

    const userEmail = localStorage.getItem('user_email') || '';
    
    if (!userEmail) {
      alert('Please sign in to export reports');
      this.isGeneratingPreview = false;
      return;
    }

    // Fetch fresh data from backend
    this.financialReportService.getReportData(userEmail, this.selectedYear)
      .subscribe({
        next: (data) => {
          // Update local data with fresh data from backend
          this.monthlyReports = data.reports || [];
          this.quarterlyReports = this.calculateQuarterlyReports(this.monthlyReports);
          this.reports = this.showQuarterly ? this.quarterlyReports : this.monthlyReports;
          this.yearSummary = data.yearSummary || this.yearSummary;

          // Prepare preview data
          const reportData = {
            monthlyReports: this.monthlyReports,
            quarterlyReports: this.quarterlyReports,
            yearSummary: this.yearSummary,
            yearlyReport: this.yearlyReport,
            selectedYear: this.selectedYear,
            format: format
          };

          // Show preview
          this.previewData = reportData;
          this.showPreview = true;
          this.isGeneratingPreview = false;
        },
        error: (error) => {
          console.error('Error fetching report data:', error);
          alert('Failed to fetch report data. Using cached data.');
          
          // Fallback to cached data
          const reportData = {
            monthlyReports: this.monthlyReports,
            quarterlyReports: this.quarterlyReports,
            yearSummary: this.yearSummary,
            yearlyReport: this.yearlyReport,
            selectedYear: this.selectedYear,
            format: format
          };

          this.previewData = reportData;
          this.showPreview = true;
          this.isGeneratingPreview = false;
        }
      });
  }

  // Replace downloadReport for PDF with client-side jsPDF
  downloadReport(): void {
    if (this.previewFormat === 'pdf') {
      this.generateClientPDF();
      this.closePreview();
      return;
    }

    // Use the already fetched data from previewData
    const reportData = {
      format: this.previewFormat,
      reportType: this.selectedReportType,
      userEmail: this.userEmail,
      data: {
        userEmail: this.userEmail,
        reports: this.showQuarterly ? this.quarterlyReports : this.monthlyReports,
        year: this.selectedYear,
        yearSummary: this.yearSummary,
        incomeBreakdown: this.getIncomeBreakdown(),
        expenseBreakdown: this.getExpenseBreakdown()
      },
      year: this.selectedYear
    };

    console.log('Downloading report with data:', reportData);

    this.financialReportService.generateReport(reportData)
      .subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const reportName = this.selectedReportType === 'income' ? 'income-statement' : 
                            this.selectedReportType === 'expense' ? 'expense-report' : 
                            'financial-report';
          a.download = `${reportName}-${this.selectedYear}.${this.previewFormat}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          this.closePreview();
        },
        error: (error) => {
          console.error('Error generating report:', error);
          alert('Failed to generate report. Please try again.');
        }
      });
  }

  // Add method to generate and download the PDF using jsPDF
  generateClientPDF(): void {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Financial Report ${this.selectedYear}`, 14, 18);

    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 26);

    // Prepare table data
    const reports = this.showQuarterly ? this.quarterlyReports : this.monthlyReports;
    const tableColumn = this.selectedReportType === 'income'
      ? ['Period', 'Income', 'Net Income']
      : ['Period', 'Income', 'Expenses', 'Net Income', 'Transactions'];
    const tableRows = reports.map(r => this.selectedReportType === 'income'
      ? [r.name, `$${r.income.toFixed(2)}`, `$${r.netIncome.toFixed(2)}`]
      : [r.name, `$${r.income.toFixed(2)}`, `$${r.expenses.toFixed(2)}`, `$${r.netIncome.toFixed(2)}`, r.transactions]
    );

    // Add table using autoTable
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 32,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 11 }
    });

    // Add summary
    let summaryY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(13);
    doc.text('Year Summary:', 14, summaryY);
    doc.setFontSize(11);
    doc.text(`Total Income: $${this.yearSummary.totalIncome.toFixed(2)}`, 14, summaryY + 8);
    doc.text(`Total Expenses: $${this.yearSummary.totalExpenses.toFixed(2)}`, 14, summaryY + 16);
    doc.text(`Net Savings: $${this.yearSummary.netSavings.toFixed(2)}`, 14, summaryY + 24);
    doc.text(`Savings Rate: ${this.yearSummary.savingsRate.toFixed(1)}%`, 14, summaryY + 32);

    // Save/download PDF
    const reportName = this.selectedReportType === 'income' ? 'income-statement' :
      this.selectedReportType === 'expense' ? 'expense-report' : 'financial-report';
    doc.save(`${reportName}-${this.selectedYear}.pdf`);
  }

  // Add helper methods to get breakdown data
  private getIncomeBreakdown() {
    const breakdown: any = {};
    this.monthlyReports.forEach(report => {
      breakdown[report.name] = report.income;
    });
    return breakdown;
  }

  private getExpenseBreakdown() {
    const breakdown: any = {};
    this.monthlyReports.forEach(report => {
      breakdown[report.name] = report.expenses;
    });
    return breakdown;
  }

  public generateReportBlob(format: string): Blob {
    let content = '';
    let type = '';

    switch (format) {
      case 'csv':
        content = this.generateCSV();
        type = 'text/csv';
        break;
      case 'excel':
        content = this.generateExcel();
        type = 'application/vnd.ms-excel';
        break;
      case 'pdf':
      default:
        content = this.generatePDF();
        type = 'application/pdf';
    }

    return new Blob([content], { type });
  }

  // Update generateCSV to handle income statement
  public generateCSV(): string {
    const reports = this.showQuarterly ? this.quarterlyReports : this.monthlyReports;
    
    if (this.selectedReportType === 'income') {
      const headers = ['Period', 'Income', 'Net Income'];
      const rows = reports.map(r => [
        r.name,
        r.income.toFixed(2),
        r.netIncome.toFixed(2)
      ]);
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    
    // Default format
    const headers = ['Period', 'Income', 'Expenses', 'Net Income', 'Transactions'];
    const rows = reports.map(r => [
      r.name,
      r.income.toFixed(2),
      r.expenses.toFixed(2),
      r.netIncome.toFixed(2),
      r.transactions
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  // Update generateExcel to handle income statement
  public generateExcel(): string {
    const reports = this.showQuarterly ? this.quarterlyReports : this.monthlyReports;
    const title = this.selectedReportType === 'income' ? 'Income Statement' : 
                  this.selectedReportType === 'expense' ? 'Expense Report' : 
                  'Financial Report';
    
    if (this.selectedReportType === 'income') {
      return `
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #2563eb; text-align: center; }
              table { border-collapse: collapse; width: 100%; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #3b82f6; color: white; font-weight: bold; }
              tr:nth-child(even) { background-color: #f9fafb; }
              .total-row { background-color: #dbeafe !important; font-weight: bold; }
            </style>
          </head>
          <body>
            <h1>${title} ${this.selectedYear}</h1>
            <table>
              <tr>
                <th>Period</th>
                <th>Total Income</th>
                <th>Net Income</th>
              </tr>
              ${reports.map(r => `
                <tr>
                  <td>${r.name}</td>
                  <td>$${r.income.toFixed(2)}</td>
                  <td>$${r.netIncome.toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td>TOTAL</td>
                <td>$${this.yearSummary.totalIncome.toFixed(2)}</td>
                <td>$${this.yearSummary.netSavings.toFixed(2)}</td>
              </tr>
            </table>
          </body>
        </html>
      `;
    }
    
    // Default format - existing code
    return `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>${title} ${this.selectedYear}</h1>
          <table>
            <tr>
              <th>Period</th>
              <th>Income</th>
              <th>Expenses</th>
              <th>Net Income</th>
              <th>Transactions</th>
            </tr>
            ${reports.map(r => `
              <tr>
                <td>${r.name}</td>
                <td>$${r.income.toFixed(2)}</td>
                <td>$${r.expenses.toFixed(2)}</td>
                <td>$${r.netIncome.toFixed(2)}</td>
                <td>${r.transactions}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `;
  }

  private generatePDF(): string {
    // For PDF, return HTML template that will be converted to PDF
    // You'll need to implement actual PDF generation using a library like pdfmake
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .header { text-align: center; margin-bottom: 20px; }
            .report-table { width: 100%; border-collapse: collapse; }
            .report-table th, .report-table td { border: 1px solid #ddd; padding: 8px; }
            .summary { margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Financial Report ${this.selectedYear}</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          <!-- Add report content here -->
        </body>
      </html>
    `;
  }

  closePreview(): void {
    this.showPreview = false;
    this.previewData = null;
  }

  // Add method to generate income statement
  generateIncomeStatement(): void {
    this.selectedReportType = 'income';
    this.exportReport('pdf'); // or any format you prefer
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  closeProfileMenu() {
    this.showProfileMenu = false;
  }

  logout() {
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_id');
    this.closeProfileMenu();
    window.location.href = '/';
  }
}
