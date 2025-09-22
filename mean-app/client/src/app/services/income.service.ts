import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class IncomeService {
  private apiUrl = environment.apiUrl;  // backend URL
  constructor(private http: HttpClient) {}
  addIncome(incomeData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/income`, incomeData);
  }
}
