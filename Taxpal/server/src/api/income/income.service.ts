import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Income {
  _id: string;
  userId: string;
  source: string;          // server’s canonical field
  description?: string;    // exposed via alias/virtual
  category: string;
  amount: number;
  date: string;            // ISO
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateIncomeBody = {
  source?: string;         // you can send either…
  description?: string;    // …this alias (server normalizes)
  category?: string;
  amount: number;
  date?: string | Date;    // optional (defaults to now)
  notes?: string;
};

export type UpdateIncomeBody = Partial<CreateIncomeBody>;

@Injectable({ providedIn: 'root' })
export class IncomeService {
  // If you use a dev proxy mapping `/api` -> backend
  private base = '/api/v1/incomes';
  // Otherwise: private base = 'http://localhost:3000/api/v1/incomes';

  constructor(private http: HttpClient) {}

  create(body: CreateIncomeBody): Observable<Income> {
    const payload: any = { ...body };
    if (!payload.source && payload.description) payload.source = payload.description;
    if (payload.date instanceof Date) payload.date = payload.date.toISOString();
    return this.http.post<Income>(this.base, payload);
  }

  list(params?: {
    from?: string | Date;
    to?: string | Date;
    source?: string;
    category?: string;
  }): Observable<Income[]> {
    let p = new HttpParams();
    if (params) {
      const { from, to, source, category } = params;
      if (source) p = p.set('source', source);
      if (category) p = p.set('category', category);
      if (from) p = p.set('from', from instanceof Date ? from.toISOString() : String(from));
      if (to) p = p.set('to', to instanceof Date ? to.toISOString() : String(to));
    }
    return this.http.get<Income[]>(this.base, { params: p });
  }

  update(id: string, patch: UpdateIncomeBody): Observable<Income> {
    const payload: any = { ...patch };
    if (!payload.source && payload.description) payload.source = payload.description;
    if (payload.date instanceof Date) payload.date = payload.date.toISOString();
    return this.http.put<Income>(`${this.base}/${id}`, payload);
  }

  remove(id: string): Observable<{ ok: boolean } | Income> {
    return this.http.delete<{ ok: boolean } | Income>(`${this.base}/${id}`);
  }
}
