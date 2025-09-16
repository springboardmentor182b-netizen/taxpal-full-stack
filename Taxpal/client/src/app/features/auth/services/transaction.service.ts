// src/app/core/services/transaction.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// ✅ correct path from core/services → src/environments/environment
import { environment } from '../../../../environments/environment';

// // ✅ strongly-typed models (adjust these two lines if your interfaces are elsewhere)
// import type { Income } from '../components/expense/expense.model';
// // If your Income interface is under components, use:
// // import type { Income } from '../../features/auth/components/income/income.model';

// import type { Expense } from '../components/income/';
// // If your Expense interface is under components, use:
// // import type { Expense } from '../../features/auth/components/expense/expense.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private http = inject(HttpClient);
  // Use environment if present; fall back to /api/v1
  private base = environment?.API_URL || '/api/v1';

  // ─────────────── INCOMES ───────────────
  createIncome(payload: Income): Observable<Income> {
    return this.http.post<Income>(`${this.base}/incomes`, payload);
  }

  getIncomes(params?: { from?: string; to?: string; source?: string }): Observable<Income[]> {
    let p = new HttpParams();
    if (params?.from) p = p.set('from', params.from);
    if (params?.to) p = p.set('to', params.to);
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
    if (params?.to) p = p.set('to', params.to);
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
