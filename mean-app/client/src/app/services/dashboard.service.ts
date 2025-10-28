import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:5000/api/v1/dashboard';

  constructor(private http: HttpClient) {}

  // Get dashboard for a specific user
  getDashboard(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  // Replace the dashboard completely (updates all fields and transactions)
  updateDashboard(userId: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/upsert/${userId}`, data);
  }

  // Only create a new dashboard if needed
  createDashboard(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Add a single transaction to the dashboard
addTransaction(dashboardId: string, txData: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/${dashboardId}/transaction`, txData);
}

  deleteTransaction(dashboardId: string, txId: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${dashboardId}/transaction/${txId}`);
}
}




