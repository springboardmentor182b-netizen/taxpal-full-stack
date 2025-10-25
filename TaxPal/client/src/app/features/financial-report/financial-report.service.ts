import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinancialReportService {
  private apiUrl = '/api/financialReports';

  constructor(private http: HttpClient) {}

  getFinancialReport(userId: string, year: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate`, {
      userId,
      year,
      reportType: 'monthly',
      period: year.toString(),
      format: 'data'
    });
  }

  exportReport(year: number, format: string): Observable<Blob> {
    const userId = localStorage.getItem('user_id') || '';
    // First generate the report with the specified format
    return this.http.post(`${this.apiUrl}/generate`, {
      userId,
      year,
      reportType: 'monthly',
      period: year.toString(),
      format: format
    }).pipe(
      // Assuming the response has the report id
      // Then download the file
      switchMap((response: any) => {
        const reportId = response._id || response.id;
        return this.http.get(`${this.apiUrl}/${reportId}/download`, {
          responseType: 'blob'
        });
      })
    );
  }

  // Add method to fetch report data
  getReportData(userEmail: string, year: number): Observable<any> {
    return this.http.get(`/api/reports/data/${encodeURIComponent(userEmail)}/${year}`);
  }

  generateReport(data: any): Observable<Blob> {
    return this.http.post('/api/reports/generate-report', data, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
