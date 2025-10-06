import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/** What the server returns for a budget */
export interface BudgetDTO {
  _id: string;
  userId?: string;
  category: string;
  amount: number;
  month: string;           // 'YYYY-MM'
  monthStart: string;      // ISO date string
  description?: string;
  createdAt?: string;      // ISO
  updatedAt?: string;      // ISO
}

/** Create payload you already use */
export type CreateBudgetBody = {
  category: string;
  amount: number;
  month: string;           // 'YYYY-MM'
  description?: string;
  monthStart?: string;     // optional ISO; server infers if omitted
};

/** Optional filters for list() */
export type BudgetListQuery = {
  month?: string;          // 'YYYY-MM'
  category?: string;
  limit?: number;
  skip?: number;
};

@Injectable({ providedIn: 'root' })
export class BudgetService {
  /**
   * If you have proxy.conf.json mapping "/api" → http://localhost:3000:
   *   { "/api": { "target": "http://localhost:3000", "secure": false, "changeOrigin": true } }
   */
  private readonly base = '/api/v1/budgets';
  // If you don't use a proxy during dev, use:
  // private readonly base = 'http://localhost:3000/api/v1/budgets';

  constructor(private http: HttpClient) {}

  /** Create a budget */
  create(body: CreateBudgetBody): Observable<BudgetDTO> {
    return this.http.post<BudgetDTO>(this.base, body /* , { withCredentials: true } */);
  }

  /** List budgets with optional filters */
  list(query?: BudgetListQuery): Observable<BudgetDTO[]> {
    let params = new HttpParams();
    if (query) {
      Object.entries(query).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
      });
    }
    return this.http.get<BudgetDTO[]>(this.base, { params /* , withCredentials: true */ });
  }

  /** Get one budget by id (optionally scoping by user on server) */
  getById(id: string): Observable<BudgetDTO | null> {
    return this.http.get<BudgetDTO>(`${this.base}/${encodeURIComponent(id)}`);
  }

  /** Patch/update a budget (server recomputes monthStart if month changes) */
  update(id: string, patch: Partial<CreateBudgetBody>): Observable<BudgetDTO> {
    return this.http.patch<BudgetDTO>(`${this.base}/${encodeURIComponent(id)}`, patch);
  }

  /** Delete a budget */
  remove(id: string): Observable<{ ok: boolean } | { deleted: boolean } | void> {
    return this.http.delete<void>(`${this.base}/${encodeURIComponent(id)}`);
  }
}
