import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PreviewRequest {
  id?: string;
  reportType: 'income-statement' | 'balance-sheet' | 'cash-flow';
  period: 'current-month' | 'last-month' | 'this-quarter' | 'this-year';
  format: 'pdf' | 'csv' | 'xlsx';
}

export interface PreviewResponse {
  filename: string;
  mimeType: string;
  base64?: string; // only for PDF preview
}

@Injectable({ providedIn: 'root' })
export class ExportService {
  private http = inject(HttpClient);
  private base = '/api/export';

  preview(body: PreviewRequest): Observable<PreviewResponse> {
    return this.http.post<PreviewResponse>(`${this.base}/preview`, body);
  }

  download(body: PreviewRequest) {
    return this.http.post(`${this.base}/download`, body, { responseType: 'blob' });
  }
}
