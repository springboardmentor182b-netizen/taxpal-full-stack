import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { Expense } from '../models/expense.model';
import { Income } from '../models/income.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private http = inject(HttpClient);
  private base = environment.API_URL;

  // EXPENSES
  createExpense(payload: Expense): Observable<Expense> {
    return this.http.post<Expense>(`${this.base}/expenses`, payload);
  }
  getExpenses(params?: {from?: string; to?: string; category?: string;}): Observable<Expense[]> {
    let p = new HttpParams();
    if (params?.from) p = p.set('from', params.from);
    if (params?.to) p = p.set('to', params.to);
    if (params?.category) p = p.set('category', params.category);
    return this.http.get<Expense[]>(`${this.base}/expenses`, { params: p });
  }
  deleteExpense(id: string) { return this.http.delete(`${this.base}/expenses/${id}`); }
  updateExpense(id: string, payload: Partial<Expense>): Observable<Expense> {
    return this.http.put<Expense>(`${this.base}/expenses/${id}`, payload);
  }

  // INCOMES
  createIncome(payload: Income): Observable<Income> {
    return this.http.post<Income>(`${this.base}/incomes`, payload);
  }
  getIncomes(params?: {from?: string; to?: string; source?: string;}): Observable<Income[]> {
    let p = new HttpParams();
    if (params?.from) p = p.set('from', params.from);
    if (params?.to) p = p.set('to', params.to);
    if (params?.source) p = p.set('source', params.source);
    return this.http.get<Income[]>(`${this.base}/incomes`, { params: p });
  }
  deleteIncome(id: string) { return this.http.delete(`${this.base}/incomes/${id}`); }
  updateIncome(id: string, payload: Partial<Income>): Observable<Income> {
    return this.http.put<Income>(`${this.base}/incomes/${id}`, payload);
  }
}
