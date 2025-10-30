import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaxService {
  private apiUrl = 'https://your-api-endpoint.com'; // Replace later

  constructor(private http: HttpClient) {}

  getTaxReminders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reminders`);
  }

  calculateTax(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/calculate-tax`, data);
  }
}
