import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  // 🔹 Using environment-based API URL
  private apiUrl = `${environment.apiUrl}/dashboard`; 

  constructor(private http: HttpClient) {}

  // 🔹 Create new dashboard
  createDashboard(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // 🔹 Get dashboard for a specific user
  getDashboard(userId: string): Observable<any> {
    console.log('Fetching dashboard for userId:', userId);
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  // 🔹 Update existing dashboard (or create if missing)
  updateDashboard(userId: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${userId}`, data);
  }

  // 🔹 Upsert dashboard (create or update automatically)
  upsertDashboard(userId: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/upsert/${userId}`, data);
  }

  // 🔹 Add a single transaction to the dashboard
  addTransaction(dashboardId: string, txData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${dashboardId}/transactions`, txData);
  }

  // 🔹 Delete a specific transaction
  deleteTransaction(dashboardId: string, txId: string): Observable<any> {
    // This should match your backend route:
    // router.delete('/:dashboardId/transactions/:txId', deleteTransaction)
    return this.http.delete(`${this.apiUrl}/${dashboardId}/transactions/${txId}`);
  }
}