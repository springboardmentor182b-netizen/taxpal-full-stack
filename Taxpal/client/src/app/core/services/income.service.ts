import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class IncomeService {
  private readonly API = `${environment.API_URL}/incomes`;
  constructor(private http: HttpClient) {}

  addIncome(payload: { description: string; amount: number; category: string; date: string; notes?: string }): Observable<any> {
    return this.http.post<any>(this.API, payload);
  }
}
