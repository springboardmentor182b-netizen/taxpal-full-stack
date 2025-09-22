import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private apiUrl = environment.apiUrl;  // backend URL
  constructor(private http: HttpClient) {}
  addExpense(expenseData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/expense`, expenseData);
  }
}
