import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:5000/api/v1/dashboard'; // backend endpoint

  constructor(private http: HttpClient) {}

  // Create new dashboard
  createDashboard(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Get dashboard for a specific user
  getDashboard(userId: string): Observable<any> {
    console.log('Fetching dashboard for userId:', userId); // ✅ log userId
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  // Update existing dashboard (or create if missing)
  updateDashboard(userId: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${userId}`, data);
  }
  upsertDashboard(userId: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/upsert/${userId}`, data);
  }
  
}
