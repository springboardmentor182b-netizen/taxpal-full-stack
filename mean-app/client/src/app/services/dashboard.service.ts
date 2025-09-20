import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:5000/api/dashboard'; // backend endpoint

  constructor(private http: HttpClient) {}

  createDashboard(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getDashboards(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
