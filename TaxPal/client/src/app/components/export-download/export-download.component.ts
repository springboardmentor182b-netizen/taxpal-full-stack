import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { REPORT_TYPES, REPORT_FORMATS, REPORT_PERIODS } from '../../constants/report-options.constants';

@Component({
  selector: 'app-export-download',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './export-download.component.html',
  styleUrls: ['./export-download.component.css']
})
export class ExportDownloadComponent {
  reportTypes = REPORT_TYPES;
  formats = REPORT_FORMATS;
  periods = REPORT_PERIODS;

  selectedReport = this.reportTypes[0];
  selectedFormat = this.formats[0];
  selectedPeriod = this.periods[0];
  loading = false;
  downloadUrl = '';

  constructor(private http: HttpClient) {}

  generateReport() {
    this.loading = true;

    const userEmail = localStorage.getItem('user_email') || '';
    const currentYear = new Date().getFullYear();

    const body = {
      format: this.selectedFormat.toLowerCase(),
      reportType: this.selectedReport.toLowerCase().replace(/\s+/g, '_'),
      userEmail: userEmail,
      data: {
        userEmail: userEmail,
        year: currentYear,
        reports: [], // This will be populated by the backend
        yearSummary: {
          totalIncome: 0,
          totalExpenses: 0,
          netSavings: 0
        }
      },
      year: currentYear
    };

    // Use the correct endpoint that we created
    this.http.post('/api/reports/generate-report', body, { responseType: 'blob' })
      .subscribe({
        next: (res: Blob) => {
          this.loading = false;
          const blob = new Blob([res], { type: this.getMimeType(this.selectedFormat) });
          const url = window.URL.createObjectURL(blob);
          this.downloadUrl = url;
          this.downloadFile(url);

          // Optional: clear message after few seconds
          setTimeout(() => this.downloadUrl = '', 4000);
        },
        error: (err) => {
          this.loading = false;
          console.error('Error generating report:', err);
          alert('Failed to generate report. Please try again.');
        }
      });
  }

  getMimeType(format: string): string {
    switch (format.toLowerCase()) {
      case 'pdf': return 'application/pdf';
      case 'excel': return 'application/vnd.ms-excel';
      case 'csv': return 'text/csv';
      default: return 'application/octet-stream';
    }
  }

  downloadFile(url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.selectedReport.replace(/\s+/g, '_')}_${this.selectedPeriod.replace(/\s+/g, '_')}.${this.selectedFormat.toLowerCase()}`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
