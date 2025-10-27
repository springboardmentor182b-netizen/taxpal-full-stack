import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';

export interface Transaction {
  _id: string;
  user_id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionRequest {
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date?: Date | string;
  description?: string;
}

export interface UpdateTransactionRequest {
  type?: 'income' | 'expense';
  category?: string;
  amount?: number;
  date?: Date | string;
  description?: string;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: 'income' | 'expense';
  category?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'date' | 'createdAt' | 'amount';
  sortDir?: 'asc' | 'desc';
}

export interface TransactionSummary {
  typeStats: Array<{ _id: 'income' | 'expense'; total: number; count: number }>;
  categoryStats: Array<{ _id: string; total: number; count: number }>;
}

export interface TransactionResponse {
  transactions: Transaction[];
  totalPages: number;
  currentPage: number;
  total: number;
}

type TransactionDTO = Omit<Transaction, 'date' | 'createdAt' | 'updatedAt'> & {
  date: string;
  createdAt: string;
  updatedAt: string;
};
interface TransactionResponseDTO extends Omit<TransactionResponse, 'transactions'> {
  transactions: TransactionDTO[];
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly BASE =
    (environment as any)?.API_URL && typeof (environment as any).API_URL === 'string'
      ? (environment as any).API_URL
      : '/api/v1';

  private readonly API = `${this.BASE}/transactions`;

  constructor(private http: HttpClient) {}

  private toISO(d?: Date | string): string | undefined {
    if (!d) return undefined;
    return typeof d === 'string' ? d : d.toISOString();
  }

  private fromDTO(t: TransactionDTO): Transaction {
    return {
      ...t,
      date: new Date(t.date),
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt),
    };
  }

  private buildParams(filters?: TransactionFilters): HttpParams {
    let params = new HttpParams();
    if (!filters) return params;
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
    });
    return params;
  }

  // ---------- Queries ----------
  getTransactions(filters?: TransactionFilters): Observable<TransactionResponse> {
    const params = this.buildParams(filters);
    return this.http.get<TransactionResponseDTO>(this.API, { params }).pipe(
      map((r) => ({
        ...r,
        transactions: r.transactions.map((t) => this.fromDTO(t)),
      }))
    );
  }

  getRecentTransactions(limit = 8): Observable<Transaction[]> {
    const params: TransactionFilters = { page: 1, limit, sortBy: 'date', sortDir: 'desc' };
    return this.getTransactions(params).pipe(
      map((r) => [...r.transactions].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, limit))
    );
  }

  getTransaction(id: string): Observable<Transaction> {
    return this.http
      .get<TransactionDTO>(`${this.API}/${encodeURIComponent(id)}`)
      .pipe(map(this.fromDTO.bind(this)));
  }

  // ---------- Commands ----------
  createTransaction(
    payload: CreateTransactionRequest
  ): Observable<{ message: string; transaction: Transaction }> {
    const body = { ...payload, date: this.toISO(payload.date) };
    return this.http
      .post<{ message: string; transaction: TransactionDTO }>(this.API, body)
      .pipe(map((res) => ({ message: res.message, transaction: this.fromDTO(res.transaction) })));
  }

  updateTransaction(
    id: string,
    payload: UpdateTransactionRequest
  ): Observable<{ message: string; transaction: Transaction }> {
    const body = { ...payload, date: this.toISO(payload.date) };
    return this.http
      .put<{ message: string; transaction: TransactionDTO }>(`${this.API}/${encodeURIComponent(id)}`, body)
      .pipe(map((res) => ({ message: res.message, transaction: this.fromDTO(res.transaction) })));
  }

  /** Delete a single transaction by id */
  deleteTransaction(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API}/${encodeURIComponent(id)}`);
  }

  /** Delete ALL transactions for the authenticated user */
  deleteAll(): Observable<{ message: string; deletedCount: number }> {
    return this.http.delete<{ message: string; deletedCount: number }>(this.API);
  }

  getTransactionSummary(startDate?: string, endDate?: string): Observable<TransactionSummary> {
    const params = this.buildParams({ startDate, endDate });
    return this.http.get<TransactionSummary>(`${this.API}/summary/stats`, { params });
  }
}
