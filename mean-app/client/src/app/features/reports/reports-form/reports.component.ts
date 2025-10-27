import { Component, signal, WritableSignal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../../../features/auth.service';
import { ReportsService } from '../../../services/reports.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface Report {
  _id?: string;
  reportType: string;
  period: string;
  format: string;
  status?: string;
  createdAt?: string;
  generatedAt?: string;
  fileUrl?: string;
  fileName?: string;
  errorMessage?: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsComponent implements OnInit {
  public isFormVisible = signal(false);

  public newReport: WritableSignal<{
    reportType: string | null;
    reportPeriod: string | null;
    format: string;
    customPeriod?: { startDate: Date; endDate: Date };
  }> = signal({
    reportType: null,
    reportPeriod: null,
    format: 'PDF'
  });

  recentReports: Report[] = [];
  userInitials = '';
  currentUser: User = { id: '', fullName: '', email: '', username: '' };

  // Preview & Print functionality
  selectedReport: Report | null = null;
  previewUrl: SafeResourceUrl | null = null;
  showPreviewModal = signal(false);

  constructor(
    private reportsService: ReportsService,
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUser = user;
      this.setUserInitials(user.fullName);
      this.fetchReports();
    } else {
      this.router.navigate(['/login']);
    }
  }

  private setUserInitials(fullName: string | null | undefined): void {
    if (!fullName) {
      this.userInitials = "";
      return;
    }

    const parts = fullName.trim().split(" ");
    this.userInitials = parts
      .map(p => p.charAt(0).toUpperCase())
      .join("");
  }

  fetchReports(): void {
    if (!this.currentUser.id) return;
    this.reportsService.getReports(this.currentUser.id).subscribe({
      next: (res) => (this.recentReports = res || []),
      error: (err) => {
        console.error('Error fetching reports:', err);
        this.recentReports = [];
      }
    });
  }

  generateReport(): void {
    const formData = this.newReport();

    if (!formData.reportType || !formData.reportPeriod) {
      console.error('Please fill in report type and period');
      return;
    }

    if (!this.currentUser.id) {
      console.error('User not logged in');
      return;
    }

    const payload: any = {
      userId: this.currentUser.id,
      reportType: formData.reportType,
      period: formData.reportPeriod,
      format: formData.format
    };

    if (formData.reportPeriod === 'Custom' && formData.customPeriod) {
      payload.customPeriod = formData.customPeriod;
    }

    console.log('Payload for report generation:', payload);

    this.reportsService.generateReport(payload).subscribe({
      next: (res: any) => {
        console.log('Report generation started:', res);
        if (res.success && res.data) {
          this.recentReports.unshift(res.data);
        }
        this.resetForm();
        this.isFormVisible.set(false);
      },
      error: (err) => console.error('Error generating report:', err)
    });
  }

  resetForm(): void {
    this.newReport.set({ reportType: null, reportPeriod: null, format: 'PDF' });
  }

  downloadReport(report: Report): void {
    if (!report._id || !report.format) return;

    this.reportsService.downloadReport(report._id, report.format).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = report.fileName || `${report.reportType}.${report.format.toLowerCase()}`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Download failed:', err)
    });
  }

  // NEW: Preview Report
  previewReport(report: Report): void {
    if (!report._id) return;

    this.selectedReport = report;
    
    this.reportsService.downloadReport(report._id, report.format).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.showPreviewModal.set(true);
      },
      error: (err) => {
        console.error('Preview failed:', err);
        alert('Failed to preview report');
      }
    });
  }

  // NEW: Close Preview
  closePreview(): void {
    this.showPreviewModal.set(false);
    this.selectedReport = null;
    if (this.previewUrl) {
      // Clean up blob URL
      this.previewUrl = null;
    }
  }

  // NEW: Print Report
  printReport(): void {
    if (!this.previewUrl) return;

    const iframe = document.querySelector('#previewIframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.print();
    }
  }

  addReport(): void {
    this.generateReport();
  }

  updateNewReportType(value: string | null) {
    this.newReport.set({ ...this.newReport(), reportType: value });
  }

  updateNewReportPeriod(value: string | null) {
    this.newReport.set({ ...this.newReport(), reportPeriod: value });
  }

  updateNewReportFormat(value: string | null) {
    this.newReport.set({ ...this.newReport(), format: value || 'PDF' });
  }
}
