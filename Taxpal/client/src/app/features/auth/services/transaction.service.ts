// src/app/core/services/transaction.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// ✅ correct path to environment from core/services/*
import { environment } from '../../../../environments/environments';

// ✅ import the interfaces from your component files (since you defined them there)
// If you later move the interfaces to a dedicated models/ folder, just change these two lines.
import type { Income } from '../../features/auth/components/income/income.model';
import type { Expense } from '../../features/auth/components/expense/expense.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private http = inject(HttpClient);
  private base = environment?.API_URL || '/api/v1';

  // ─────────────── INCOMES ───────────────
  createIncome(payload: Income): Observable<Income> {
    return this.http.post<Income>(`${this.base}/incomes`, payload);
  }

  getIncomes(params?: { from?: string; to?: string; source?: string }): Observable<Income[]> {
    let p = new HttpParams();
    if (params?.from) p = p.set('from', params.from);
    if (params?.to)   p = p.set('to', params.to);
    if (params?.source) p = p.set('source', params.source);
    return this.http.get<Income[]>(`${this.base}/incomes`, { params: p });
  }

  updateIncome(id: string, payload: Partial<Income>): Observable<Income> {
    return this.http.put<Income>(`${this.base}/incomes/${id}`, payload);
  }

  deleteIncome(id: string): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.base}/incomes/${id}`);
  }

  // ─────────────── EXPENSES ───────────────
  createExpense(payload: Expense): Observable<Expense> {
    return this.http.post<Expense>(`${this.base}/expenses`, payload);
  }

  getExpenses(params?: { from?: string; to?: string; category?: string }): Observable<Expense[]> {
    let p = new HttpParams();
    if (params?.from) p = p.set('from', params.from);
    if (params?.to)   p = p.set('to', params.to);
    if (params?.category) p = p.set('category', params.category);
    return this.http.get<Expense[]>(`${this.base}/expenses`, { params: p });
  }

  updateExpense(id: string, payload: Partial<Expense>): Observable<Expense> {
    return this.http.put<Expense>(`${this.base}/expenses/${id}`, payload);
  }

  deleteExpense(id: string): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.base}/expenses/${id}`);
  }
}
