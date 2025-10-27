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
  
  // Preview functionality
  showPreview = false;
  previewData: any = null;
  previewLoading = false;

  constructor(private http: HttpClient) {}

  // Show preview before download
  showReportPreview() {
    this.previewLoading = true;
    
    const userEmail = localStorage.getItem('user_email') || '';
    const currentYear = new Date().getFullYear();

    const body = {
      reportType: this.selectedReport.toLowerCase().replace(/\s+/g, '_'),
      userEmail: userEmail,
      data: {
        userEmail: userEmail,
        year: currentYear,
        reports: [],
        yearSummary: {
          totalIncome: 0,
          totalExpenses: 0,
          netSavings: 0
        }
      },
      year: currentYear
    };

    this.http.post('/api/reports/preview-report', body)
      .subscribe({
        next: (response: any) => {
          this.previewLoading = false;
          this.previewData = response.data;
          this.showPreview = true;
        },
        error: (err) => {
          this.previewLoading = false;
          console.error('Error generating preview:', err);
          alert('Failed to generate preview. Please try again.');
        }
      });
  }

  closePreview() {
    this.showPreview = false;
    this.previewData = null;
  }

  downloadFromPreview() {
    if (!this.previewData) return;
    
    this.loading = true;
    
    const userEmail = localStorage.getItem('user_email') || '';

    const body = {
      format: this.selectedFormat.toLowerCase(),
      reportType: this.selectedReport.toLowerCase().replace(/\s+/g, '_'),
      userEmail: userEmail,
      data: {
        userEmail: userEmail,
        year: this.previewData.year,
        reports: this.previewData.reports,
        yearSummary: this.previewData.yearSummary
      },
      year: this.previewData.year
    };

    this.http.post('/api/reports/generate-report', body, { responseType: 'blob' })
      .subscribe({
        next: (res: Blob) => {
          this.loading = false;
          this.closePreview();
          
          const blob = new Blob([res], { type: this.getMimeType(this.selectedFormat) });
          const url = window.URL.createObjectURL(blob);
          this.downloadFile(url);
        },
        error: (err) => {
          this.loading = false;
          console.error('Error generating report:', err);
          alert('Failed to generate report. Please try again.');
        }
      });
  }

  generateReport() {
    // Now this will show preview first
    this.showReportPreview();
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
