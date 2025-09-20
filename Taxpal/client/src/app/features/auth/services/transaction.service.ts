import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// If your env file is different, adjust the import:
import { environment } from 'src/environments/environment';

export interface Income {
  _id?: string;
  description: string;
  amount: number;
  category?: string;
  date: string | Date;
  notes?: string;
}

export interface Expense {
  _id?: string;
  description: string;
  amount: number;
  category?: string;
  date: string | Date;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private http = inject(HttpClient);

  // Fallback to local API if environment doesn’t define API_URL
  private readonly base =
    (environment as any).API_URL ?? 'http://localhost:3000/api/v1';

  // ------- CREATE -------
  createIncome(payload: Income): Observable<Income> {
    return this.http.post<Income>(`${this.base}/incomes`, payload);
  }

  createExpense(payload: Expense): Observable<Expense> {
    return this.http.post<Expense>(`${this.base}/expenses`, payload);
  }

  // ------- READ -------
  getIncomes(params?: { from?: string; to?: string; category?: string }): Observable<Income[]> {
    let p = new HttpParams();
    if (params?.from) p = p.set('from', params.from);
    if (params?.to) p = p.set('to', params.to);
    if (params?.category) p = p.set('category', params.category);
    return this.http.get<Income[]>(`${this.base}/incomes`, { params: p });
  }

  getExpenses(params?: { from?: string; to?: string; category?: string }): Observable<Expense[]> {
    let p = new HttpParams();
    if (params?.from) p = p.set('from', params.from);
    if (params?.to) p = p.set('to', params.to);
    if (params?.category) p = p.set('category', params.category);
    return this.http.get<Expense[]>(`${this.base}/expenses`, { params: p });
  }

  // ------- UPDATE -------
  updateIncome(id: string, payload: Partial<Income>): Observable<Income> {
    return this.http.patch<Income>(`${this.base}/incomes/${id}`, payload);
  }

  updateExpense(id: string, payload: Partial<Expense>): Observable<Expense> {
    return this.http.patch<Expense>(`${this.base}/expenses/${id}`, payload);
  }

  // ------- DELETE -------
  deleteIncome(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/incomes/${id}`);
  }

  deleteExpense(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/expenses/${id}`);
  }
}
