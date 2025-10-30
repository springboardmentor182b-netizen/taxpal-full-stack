// src/app/core/services/expense.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// ----- Models you can tweak to match your backend -----
export interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: string;
  date: string;          // ISO yyyy-mm-dd (or ISO datetime if your API returns that)
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExpenseDto {
  description: string;
  amount: number;
  category: string;
  date: string;          // yyyy-mm-dd
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private readonly API = '/api/v1/expenses'; // relative URL works with dev proxy & prod

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  // If you already use an auth interceptor that sets Authorization,
  // you may REMOVE buildAuthHeaders() usage and drop the { headers } objects.
  private buildAuthHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    if (!token) {
      // Throwing makes it obvious why calls fail if the user isn't logged in
      throw new Error('Authentication token is missing');
    }
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  addExpense(payload: CreateExpenseDto): Observable<Expense> {
    const headers = this.buildAuthHeaders();
    return this.http.post<Expense>(this.API, payload, { headers });
  }

  listExpenses(): Observable<Expense[]> {
    const headers = this.buildAuthHeaders();
    return this.http.get<Expense[]>(this.API, { headers });
  }

  getExpense(id: string): Observable<Expense> {
    const headers = this.buildAuthHeaders();
    return this.http.get<Expense>(`${this.API}/${encodeURIComponent(id)}`, { headers });
  }

  updateExpense(id: string, changes: Partial<CreateExpenseDto>): Observable<Expense> {
    const headers = this.buildAuthHeaders();
    return this.http.put<Expense>(`${this.API}/${encodeURIComponent(id)}`, changes, { headers });
  }

  deleteExpense(id: string): Observable<{ deleted: boolean } & Partial<Expense>> {
    const headers = this.buildAuthHeaders();
    return this.http.delete<{ deleted: boolean } & Partial<Expense>>(
      `${this.API}/${encodeURIComponent(id)}`,
      { headers }
    );
  }
}
