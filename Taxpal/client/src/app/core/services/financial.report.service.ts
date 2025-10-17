import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ReportRequest, FinancialReport } from '@/app/features/financial.report/financial.report';

@Injectable({
  providedIn: 'root'
})
export class FinancialReportsService {
  private mockReports: FinancialReport[] = [
    {
      id: '1',
      name: 'Income Statement - Last Month',
      reportType: 'INCOME_STATEMENT',
      period: 'LAST_MONTH',
      format: 'PDF',
      fileSize: '2.4 MB',
      status: 'COMPLETED',
      generatedDate: new Date('2024-01-15'),
      downloadUrl: '/api/reports/1/download'
    },
    {
      id: '2',
      name: 'Balance Sheet - Current Quarter',
      reportType: 'BALANCE_SHEET',
      period: 'CURRENT_QUARTER',
      format: 'EXCEL',
      fileSize: '1.8 MB',
      status: 'COMPLETED',
      generatedDate: new Date('2024-01-10'),
      downloadUrl: '/api/reports/2/download'
    } 
  ];

  constructor() {}

  getRecentReports(): Observable<FinancialReport[]> {
    // Simulate API call with delay
    return of([...this.mockReports]).pipe(delay(1000));
  }

  generateReport(request: ReportRequest): Observable<FinancialReport> {
    // Simulate API call with delay and random success/failure
    const shouldFail = Math.random() < 0.1; // 10% chance of failure

    if (shouldFail) {
      return throwError(() => new Error('Report generation failed due to server error'));
    }

    const newReport: FinancialReport = {
      id: Math.random().toString(36).substr(2, 9),
      name: `${this.getReportTypeName(request.reportType)} - ${this.getPeriodName(request.period)}`,
      reportType: request.reportType,
      period: request.period,
      format: request.format,
      fileSize: (Math.random() * 3 + 1).toFixed(1) + ' MB',
      status: 'COMPLETED',
      generatedDate: new Date(),
      downloadUrl: `/api/reports/${Math.random().toString(36).substr(2, 9)}/download`
    };

    this.mockReports.unshift(newReport);
    
    return of(newReport).pipe(delay(2000));
  }

  downloadReport(reportId: string): Observable<{ blob: Blob, contentType: string }> {
    // Simulate file download
    const report = this.mockReports.find(r => r.id === reportId);
    
    if (!report) {
      return throwError(() => new Error('Report not found'));
    }

    // Create mock file content based on format
    let content = '';
    let contentType = '';
    
    switch (report.format) {
      case 'PDF':
        content = '%PDF-1.4 mock pdf content';
        contentType = 'application/pdf';
        break;
      case 'EXCEL':
        content = 'mock excel content';
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'CSV':
        content = 'Date,Amount,Description\n2024-01-01,1000.00,Revenue';
        contentType = 'text/csv';
        break;
    }

    const blob = new Blob([content], { type: contentType });
    
    return of({ blob, contentType }).pipe(delay(500));
  }

  deleteReport(reportId: string): Observable<void> {
    const index = this.mockReports.findIndex(report => report.id === reportId);
    
    if (index === -1) {
      return throwError(() => new Error('Report not found'));
    }

    this.mockReports.splice(index, 1);
    return of(undefined).pipe(delay(500));
  }

  private getReportTypeName(type: string): string {
    const names: { [key: string]: string } = {
      'INCOME_STATEMENT': 'Income Statement',
      'BALANCE_SHEET': 'Balance Sheet',
      'CASH_FLOW': 'Cash Flow Statement',
      'PROFIT_LOSS': 'Profit & Loss',
      'EXPENSE_REPORT': 'Expense Report'
    };
    return names[type] || type;
  }

  private getPeriodName(period: string): string {
    const names: { [key: string]: string } = {
      'CURRENT_MONTH': 'Current Month',
      'LAST_MONTH': 'Last Month',
      'CURRENT_QUARTER': 'Current Quarter',
      'LAST_QUARTER': 'Last Quarter',
      'CURRENT_YEAR': 'Current Year',
      'LAST_YEAR': 'Last Year',
      'CUSTOM': 'Custom Range'
    };
    return names[period] || period;
  }
}