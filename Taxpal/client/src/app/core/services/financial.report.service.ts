import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { ReportRequest, FinancialReport } from '@/app/features/financial.report/financial.report';
import { 
  CATEGORY_TO_REPORT_TYPE_MAP, 
  MOCK_REPORTS, 
  REPORT_TYPE_NAMES, 
  PERIOD_NAMES 
} from './financial.report.service.constants';

@Injectable({
  providedIn: 'root'
})
export class FinancialReportsService {
  private baseURL = '/api/v1/financial-reports';

  constructor(private http: HttpClient) {}

  getRecentReports(): Observable<FinancialReport[]> {
    return this.http.get<any[]>(this.baseURL).pipe(
      map(backendReports => this.mapBackendToFrontendReports(backendReports)),
      catchError(error => {
        console.error('Error fetching reports from backend, using mock data', error);
        return of(MOCK_REPORTS);
      })
    );
  }

  generateReport(request: ReportRequest): Observable<FinancialReport> {
    const shouldFail = Math.random() < 0.1;

    if (shouldFail) {
      return throwError(() => new Error('Report generation failed due to server error'));
    }

    const newReport: FinancialReport = {
      id: Math.random().toString(36).substr(2, 9),
      name: `${REPORT_TYPE_NAMES[request.reportType]} - ${PERIOD_NAMES[request.period]}`,
      reportType: request.reportType,
      period: request.period,
      format: request.format,
      fileSize: (Math.random() * 3 + 1).toFixed(1) + ' MB',
      status: 'COMPLETED',
      generatedDate: new Date(),
      downloadUrl: `${this.baseURL}/download/${Math.random().toString(36).substr(2, 9)}`
    };

    return this.http.post<any>(this.baseURL, this.mapFrontendToBackendReport(newReport)).pipe(
      map(() => newReport),
      delay(2000)
    );
  }

  downloadReport(reportId: string): Observable<{ blob: Blob, contentType: string }> {
    const report = MOCK_REPORTS.find(r => r.id === reportId);
    let downloadUrl = '';
    
    switch (report?.format) {
      case 'PDF':
        downloadUrl = `${this.baseURL}/export/pdf`;
        break;
      case 'EXCEL':
        downloadUrl = `${this.baseURL}/export/excel`;
        break;
      case 'CSV':
        downloadUrl = `${this.baseURL}/export/csv`;
        break;
      default:
        downloadUrl = `${this.baseURL}/export/pdf`;
    }

    return this.http.get(downloadUrl, { responseType: 'blob' }).pipe(
      map(blob => {
        let contentType = '';
        switch (report?.format) {
          case 'PDF':
            contentType = 'application/pdf';
            break;
          case 'EXCEL':
            contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            break;
          case 'CSV':
            contentType = 'text/csv';
            break;
        }
        return { blob, contentType };
      }),
      catchError(error => {
        console.error('Error downloading from backend, using mock download', error);
        return of(this.mockDownload(reportId));
      })
    );
  }

  deleteReport(reportId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${reportId}`).pipe(
      catchError(error => {
        console.error('Error deleting report from backend', error);
        return throwError(() => new Error('Failed to delete report'));
      })
    );
  }

  private mapBackendToFrontendReports(backendReports: any[]): FinancialReport[] {
    return backendReports.map(backendReport => ({
      id: backendReport._id,
      name: backendReport.title,
      reportType: this.determineReportType(backendReport.category),
      period: 'CUSTOM',
      format: 'PDF',
      fileSize: this.calculateFileSize(backendReport),
      status: 'COMPLETED',
      generatedDate: new Date(backendReport.date),
      downloadUrl: `${this.baseURL}/download/${backendReport._id}`
    }));
  }

  private mapFrontendToBackendReport(frontendReport: FinancialReport): any {
    return {
      title: frontendReport.name,
      amount: 0,
      category: frontendReport.reportType,
      date: frontendReport.generatedDate
    };
  }

  private determineReportType(category: string): string {
    return CATEGORY_TO_REPORT_TYPE_MAP[category] || 'PROFIT_LOSS';
  }

  private calculateFileSize(report: any): string {
    const baseSize = JSON.stringify(report).length / 1024 / 1024;
    return (baseSize * 2.5).toFixed(1) + ' MB';
  }

  private mockDownload(reportId: string): { blob: Blob, contentType: string } {
    let content = '';
    let contentType = '';
    
    content = 'Mock financial report content for ID: ' + reportId;
    contentType = 'application/pdf';

    const blob = new Blob([content], { type: contentType });
    return { blob, contentType };
  }
}