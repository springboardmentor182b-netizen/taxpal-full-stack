import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancialReportService {
  private baseUrl = '/api/financialReports';

  constructor(private http: HttpClient) {}

  generateReport(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/generate`, data);
  }

  getReports(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}?userId=${userId}`);
  }

  downloadReport(id: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/download`, { responseType: 'blob' });
  }
}
