import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
}

export interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  description: string;
}

export interface ExpenseBreakdown {
  _id: string;
  total: number;
  count: number;
}

export interface BudgetProgress {
  category: string;
  spent: number;
  budget: number;
  percentage: number;
}

export interface TaxEstimation {
  year: number;
  totalIncome: number;
  estimatedTax: number;
  quarterlyPayment: number;
  taxRate: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_URL = 'http://localhost:5000/api/dashboard';
  private readonly headers: HttpHeaders;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('jwt');
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getDashboardSummary(): Observable<DashboardSummary> {
    this.loadingSubject.next(true);
    return this.http.get<DashboardSummary>(`${this.API_URL}/summary`, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error fetching dashboard summary:', error);
        return throwError(() => error);
      })
    );
  }

  getRecentTransactions(limit: number = 5): Observable<Transaction[]> {
    this.loadingSubject.next(true);
    return this.http.get<Transaction[]>(`${this.API_URL}/recent-transactions?limit=${limit}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error fetching recent transactions:', error);
        return throwError(() => error);
      })
    );
  }

  getExpenseBreakdown(): Observable<ExpenseBreakdown[]> {
    this.loadingSubject.next(true);
    return this.http.get<ExpenseBreakdown[]>(`${this.API_URL}/expense-breakdown`, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error fetching expense breakdown:', error);
        return throwError(() => error);
      })
    );
  }

  getBudgetProgress(): Observable<BudgetProgress[]> {
    this.loadingSubject.next(true);
    return this.http.get<BudgetProgress[]>(`${this.API_URL}/budget-progress`, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error fetching budget progress:', error);
        return throwError(() => error);
      })
    );
  }

  getTaxEstimation(year?: number): Observable<TaxEstimation> {
    this.loadingSubject.next(true);
    const url = year ? `${this.API_URL}/tax-estimation?year=${year}` : `${this.API_URL}/tax-estimation`;
    return this.http.get<TaxEstimation>(url, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error fetching tax estimation:', error);
        return throwError(() => error);
      })
    );
  }

  refreshData(): Observable<any> {
    return this.getDashboardSummary();
  }
}
