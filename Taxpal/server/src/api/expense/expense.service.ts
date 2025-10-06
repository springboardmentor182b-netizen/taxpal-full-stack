import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Expense {
  _id: string;
  userId: string;
  description: string;
  amount: number;
  category: string;
  date: string;     // ISO
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateExpenseBody = {
  description: string;
  amount: number;
  category: string;
  date: string | Date; // server expects a valid ISO date; Date is ok (we’ll convert)
  notes?: string;
};

export type UpdateExpenseBody = Partial<CreateExpenseBody>;

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  // If you have a dev proxy mapping "/api" → backend:
  private base = '/api/v1/expenses';
  // Otherwise: private base = 'http://localhost:3000/api/v1/expenses';

  constructor(private http: HttpClient) {}

  create(body: CreateExpenseBody): Observable<Expense> {
    const payload: any = { ...body };
    if (payload.date instanceof Date) payload.date = payload.date.toISOString();
    return this.http.post<Expense>(this.base, payload);
  }

  list(params?: {
    from?: string | Date;
    to?: string | Date;
    category?: string;
  }): Observable<Expense[]> {
    let p = new HttpParams();
    if (params) {
      const { from, to, category } = params;
      if (category) p = p.set('category', category);
      if (from) p = p.set('from', from instanceof Date ? from.toISOString() : String(from));
      if (to)   p = p.set('to',   to   instanceof Date ? to.toISOString()   : String(to));
    }
    return this.http.get<Expense[]>(this.base, { params: p });
  }

  update(id: string, patch: UpdateExpenseBody): Observable<Expense> {
    const payload: any = { ...patch };
    if (payload.date instanceof Date) payload.date = payload.date.toISOString();
    return this.http.put<Expense>(`${this.base}/${id}`, payload);
  }

  remove(id: string): Observable<{ deleted: true; _id: string }> {
    return this.http.delete<{ deleted: true; _id: string }>(`${this.base}/${id}`);
  }
}
