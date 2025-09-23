import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import {
  DashboardResponse,
  IncomeVsExpensesResponse,
  TrendPeriod,
} from '../../dashboard/model/dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  // If you use environment base URLs, swap this for environment.api + '/dashboard'
  private readonly base = '/api/v1/dashboard';

  // Simple in-memory caches; invalidate() clears them
  private dashCache = new Map<string, Observable<DashboardResponse>>();
  private trendCache = new Map<string, Observable<IncomeVsExpensesResponse>>();

  constructor(private http: HttpClient) {}

  /** Clear cached responses (call this after adding/updating transactions/budgets). */
  invalidate(): void {
    this.dashCache.clear();
    this.trendCache.clear();
  }

  getDashboard(month?: number, year?: number, refresh = false): Observable<DashboardResponse> {
    const key = `dash:${year ?? 'cur'}-${month ?? 'cur'}`;
    if (!refresh && this.dashCache.has(key)) return this.dashCache.get(key)!;

    let params = new HttpParams();
    if (month) params = params.set('month', String(month));
    if (year)  params = params.set('year', String(year));

    const req$ = this.http
      .get<DashboardResponse>(this.base, { params /* , withCredentials: true */ })
      .pipe(shareReplay(1));

    this.dashCache.set(key, req$);
    return req$;
  }

  getIncomeVsExpenses(period: TrendPeriod = 'month', refresh = false): Observable<IncomeVsExpensesResponse> {
    const key = `trend:${period}`;
    if (!refresh && this.trendCache.has(key)) return this.trendCache.get(key)!;

    const req$ = this.http
      .get<IncomeVsExpensesResponse>(`${this.base}/income-vs-expenses`, {
        params: { period },
        // withCredentials: true, // uncomment if you use cookie-based auth
      })
      .pipe(shareReplay(1));

    this.trendCache.set(key, req$);
    return req$;
  }
}
