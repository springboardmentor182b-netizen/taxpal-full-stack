import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ExportService {
  downloadCSV(data: any[], fileName: string): void {
    if (!data || data.length === 0) return;

    const header = Object.keys(data[0]);
    const csvRows = [header.join(','), ...data.map(row =>
      header.map(field => JSON.stringify(row[field] ?? '')).join(',')
    )];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  downloadPDF(data: any[], fileName: string): void {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`${fileName.toUpperCase()} DATA`, 10, 10);

    const keys = Object.keys(data[0] || {});
    let y = 20;
    data.forEach((row, i) => {
      keys.forEach((k, idx) => {
        doc.text(`${k}: ${row[k]}`, 10, y + idx * 6);
      });
      y += keys.length * 6 + 6;
      if (y > 270 && i < data.length - 1) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`${fileName}.pdf`);
  }


  //API Integration methods
   private baseUrl = '/api/export';

  constructor(private http: HttpClient) {}

  getAllRecords(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  exportCSV(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/csv`, {
      responseType: 'blob'
    });
  }

  exportExcel(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/excel`, {
      responseType: 'blob'
    });
  }
}
