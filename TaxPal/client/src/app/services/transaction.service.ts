import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
  _id?: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
  date?: string;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private base = '/api/transactions'; // with Angular proxy this forwards to server

  constructor(private http: HttpClient) {}

  list(params?: any): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.base, { params });
  }
  get(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.base}/${id}`);
  }
  create(payload: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.base, payload);
  }
  update(id: string, payload: Partial<Transaction>): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.base}/${id}`, payload);
  }
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
