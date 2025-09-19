import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class IncomeService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addIncome(data: any) {
    return this.http.post(`${this.baseUrl}/income`, data);
  }
  getIncomes() {
    return this.http.get(`${this.baseUrl}/income`);
  }
}
