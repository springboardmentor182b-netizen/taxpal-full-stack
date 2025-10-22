import { Component, OnInit } from '@angular/core';
import { FinancialReportsService } from '@/app/core/services/financialReport.service';

export interface ReportRequest {
  reportType: string;
  period: string;
  format: string;
  startDate?: Date;
  endDate?: Date;
}

export interface FinancialReport {
  id: string;
  name: string;
  reportType: string;
  period: string;
  format: string;
  fileSize: string;
  status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
  generatedDate: Date;
  downloadUrl?: string;
}

@Component({
  selector: 'app-financial-reports',
  templateUrl: './financial.report.html',
  styleUrls: ['./financial.report.css']
})
export class FinancialReportsComponent implements OnInit {
  reportRequest: ReportRequest = {
    reportType: 'INCOME_STATEMENT',
    period: 'CURRENT_MONTH',
    format: 'PDF'
  };

  recentReports: FinancialReport[] = [];
  isGenerating: boolean = false;
  isLoading: boolean = false;
  generationProgress: number = 0;
  errorMessage: string = '';

  constructor(private financialReportsService: FinancialReportsService) {}

  ngOnInit() {
    this.loadRecentReports();
  }

  loadRecentReports(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.financialReportsService.getRecentReports().subscribe({
      next: (reports) => {
        this.recentReports = reports;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load recent reports. Please try again.';
        this.isLoading = false;
        console.error('Error loading reports:', error);
      }
    });
  }

  generateReport(): void {
    if (this.isGenerating) return;
    
    this.isGenerating = true;
    this.generationProgress = 0;
    this.errorMessage = '';

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      this.generationProgress += 10;
      if (this.generationProgress >= 90) {
        clearInterval(progressInterval);
      }
    }, 500);

    this.financialReportsService.generateReport(this.reportRequest).subscribe({
      next: (newReport) => {
        clearInterval(progressInterval);
        this.generationProgress = 100;
        
        setTimeout(() => {
          this.isGenerating = false;
          this.generationProgress = 0;
          this.recentReports.unshift(newReport);
          // Auto-download completed report
          if (newReport.status === 'COMPLETED') {
            this.downloadReport(newReport.id);
          }
        }, 1000);
      },
      error: (error) => {
        clearInterval(progressInterval);
        this.isGenerating = false;
        this.generationProgress = 0;
        this.errorMessage = 'Failed to generate report. Please try again.';
        console.error('Error generating report:', error);
      }
    });
  }

  downloadReport(reportId: string): void {
    this.financialReportsService.downloadReport(reportId).subscribe({
      next: (downloadData) => {
        // Create a blob and download the file
        const blob = new Blob([downloadData.blob], { type: downloadData.contentType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        const report = this.recentReports.find(r => r.id === reportId);
        const extension = this.getFileExtension(report?.format);
        link.download = `financial-report-${reportId}.${extension}`;
        
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.errorMessage = 'Failed to download report. Please try again.';
        console.error('Error downloading report:', error);
      }
    });
  }

  deleteReport(reportId: string): void {
    if (confirm('Are you sure you want to delete this report?')) {
      this.financialReportsService.deleteReport(reportId).subscribe({
        next: () => {
          this.recentReports = this.recentReports.filter(report => report.id !== reportId);
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete report. Please try again.';
          console.error('Error deleting report:', error);
        }
      });
    }
  }

  resetForm(): void {
    this.reportRequest = {
      reportType: 'INCOME_STATEMENT',
      period: 'CURRENT_MONTH',
      format: 'PDF'
    };
    this.errorMessage = '';
  }

  private getFileExtension(format?: string): string {
    switch (format) {
      case 'PDF': return 'pdf';
      case 'EXCEL': return 'xlsx';
      case 'CSV': return 'csv';
      default: return 'pdf';
    }
  }
}