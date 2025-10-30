// // reports.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Report } from '../features/reports/reports-form/reports.component'; // adjust path

// @Injectable({ providedIn: 'root' })
// export class ReportsService {
//   private apiUrl = `${environment.apiUrl}/reports`;

//   constructor(private http: HttpClient) {}

//   private getHeaders(): HttpHeaders {
//     const token = localStorage.getItem('token');
//     return new HttpHeaders({ Authorization: `Bearer ${token}` });
//   }

//   // ✅ Fetch all reports for a user
//   getReports(userId: string): Observable<Report[]> {
//     return this.http.get<Report[]>(`${this.apiUrl}/${userId}`, { headers: this.getHeaders() });
//   }

//   // ✅ Generate report
//   // generateReport(payload: { reportType: string; period: string; format: string }): Observable<Report> {
//   //   return this.http.post<Report>(`${this.apiUrl}/generate`, payload, { headers: this.getHeaders() });
//   // }


  

// generateReport(payload: {
//   reportType: string;
//   period: string;
//   format?: string;
//   customPeriod?: { startDate: Date; endDate: Date };
// }) {
//   return this.http.post(`${this.apiUrl}/generate`, payload, {
//     headers: this.getHeaders()
//   });
// }



//   // ✅ Download report
//   downloadReport(id: string, format: string): Observable<Blob> {
//     return this.http.get(`${this.apiUrl}/download/${id}`, {
//       headers: this.getHeaders(),
//       responseType: 'blob'
//     });
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Report } from '../features/reports/reports-form/reports.component';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getReports(userId: string): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/${userId}`, {
      headers: this.getHeaders()
    });
  }

 
  generateReport(payload: {
    userId: string;
    reportType: string;
    period: string;
    format: string;
    customPeriod?: { startDate: Date; endDate: Date };
  }) {
    return this.http.post(`${this.apiUrl}/generate`, payload, {
      headers: this.getHeaders()
    });
  }

  downloadReport(id: string, format: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${id}`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }
}
