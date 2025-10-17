import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaxService {
  // ✅ Update this to your backend URL
  private apiUrl = 'http://localhost:5000/api/tax-estimator';

  constructor(private http: HttpClient) {}

  calculateTax(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/calculate`, data);
  }

  saveTaxEstimate(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, data);
  }

  getUserTaxEstimates(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  getTaxReminders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reminders`);
  }
}
