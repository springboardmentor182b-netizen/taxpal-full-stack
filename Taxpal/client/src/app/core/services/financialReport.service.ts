import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface FinancialReport {
  _id?: string;
  name?: string;
  reportType: 'income-statement' | 'balance-sheet' | 'cash-flow';
  period: 'current-month' | 'last-month' | 'this-quarter' | 'this-year';
  periodLabel: string;
  format: 'pdf' | 'csv' | 'xlsx';
  createdAt?: string;
}

export interface CreateFinancialReportDto {
  reportType: FinancialReport['reportType'];
  period: FinancialReport['period'];
  format: FinancialReport['format'];
}

@Injectable({ providedIn: 'root' })
export class FinancialReportService {
  private http = inject(HttpClient);
  private base = '/api/v1/financial-reports';

  listReports(): Observable<FinancialReport[]> {
    return this.http.get<{data: FinancialReport[]}>(this.base).pipe(map(r => r.data || []));
  }

  createReport(payload: CreateFinancialReportDto): Observable<FinancialReport> {
    return this.http.post<{data: FinancialReport}>(`${this.base}/generate`, payload)
      .pipe(map(r => r.data));
  }

  deleteReport(id: string) {
    return this.http.delete(`${this.base}/${id}`);
  }
}
