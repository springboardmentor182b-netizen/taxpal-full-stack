import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  date?: Date;
  description?: string;
}

export interface UpdateTransactionRequest {
  type?: 'income' | 'expense';
  category?: string;
  amount?: number;
  date?: Date;
  description?: string;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: 'income' | 'expense';
  category?: string;
  startDate?: string;
  endDate?: string;
}

export interface TransactionSummary {
  typeStats: Array<{
    _id: 'income' | 'expense';
    total: number;
    count: number;
  }>;
  categoryStats: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
}

export interface TransactionResponse {
  transactions: Transaction[];
  totalPages: number;
  currentPage: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly API_URL = 'http://localhost:3000/api/transactions';

  constructor(private http: HttpClient) {}

  getTransactions(filters?: TransactionFilters): Observable<TransactionResponse> {
    const params: any = {};
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof TransactionFilters] !== undefined) {
          params[key] = filters[key as keyof TransactionFilters];
        }
      });
    }

    return this.http.get<TransactionResponse>(this.API_URL, { params });
  }

  getTransaction(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.API_URL}/${id}`);
  }

  createTransaction(transaction: CreateTransactionRequest): Observable<{ message: string; transaction: Transaction }> {
    return this.http.post<{ message: string; transaction: Transaction }>(this.API_URL, transaction);
  }

  updateTransaction(id: string, transaction: UpdateTransactionRequest): Observable<{ message: string; transaction: Transaction }> {
    return this.http.put<{ message: string; transaction: Transaction }>(`${this.API_URL}/${id}`, transaction);
  }

  deleteTransaction(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`);
  }

  getTransactionSummary(startDate?: string, endDate?: string): Observable<TransactionSummary> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return this.http.get<TransactionSummary>(`${this.API_URL}/summary/stats`, { params });
  }
}
