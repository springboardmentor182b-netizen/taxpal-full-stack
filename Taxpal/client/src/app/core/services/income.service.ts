// src/app/core/services/income.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface IncomeDto {
  description: string;   // alias for server's "source"
  amount: number;
  category: string;
  date: string;          // yyyy-mm-dd
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class IncomeService {
  private readonly API = '/api/v1/incomes';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  private buildAuthHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    if (!token) throw new Error('Authentication token is missing');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
    // If you use an interceptor, you can remove this and the { headers } objects below.
  }

  create(payload: IncomeDto): Observable<any> {
    const headers = this.buildAuthHeaders();
    // server normalizes: `source` from `description` if needed
    return this.http.post<any>(this.API, payload, { headers });
  }

  // (optional) add list/update/delete like in ExpenseService if you need them
}
