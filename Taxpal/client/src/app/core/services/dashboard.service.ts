import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private base = '/api/v1/dashboard';

  constructor(private http: HttpClient) {}

  /** Bust any local caches if you keep them elsewhere */
  invalidate() {
    // no-op for now; hook if you add caching
  }

  getDashboard(month?: number, year?: number, current: boolean = true): Observable<any> {
    let params = new HttpParams();
    if (!current) {
      if (month) params = params.set('month', String(month));
      if (year)  params = params.set('year', String(year));
    }
    return this.http.get<any>(`${this.base}`, { params });
  }

  /**
   * period: 'month' | 'quarter' | 'year'
   * If you pass custom month/year, they are used for month/quarter ranges.
   */
  getIncomeVsExpenses(period: 'month'|'quarter'|'year' = 'month', current: boolean = true, month?: number, year?: number): Observable<any> {
    let params = new HttpParams().set('period', period);
    if (!current) {
      if (month) params = params.set('month', String(month));
      if (year)  params = params.set('year', String(year));
    }
    return this.http.get<any>(`${this.base}/income-vs-expenses`, { params });
  }

  /** NEW: Recent transactions */
  getRecentTransactions(limit: number = 8, startDate?: string, endDate?: string): Observable<{ transactions: any[] }> {
    let params = new HttpParams().set('limit', String(limit));
    if (startDate) params = params.set('startDate', startDate);
    if (endDate)   params = params.set('endDate', endDate);
    return this.http.get<{ transactions: any[] }>(`${this.base}/recent`, { params });
  }
}
