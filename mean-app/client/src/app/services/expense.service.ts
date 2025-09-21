import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addExpense(data: any) {
    return this.http.post(`${this.baseUrl}/expense`, data);
  }
  getExpense() {
    return this.http.get(`${this.baseUrl}/expense`);
  }
}
