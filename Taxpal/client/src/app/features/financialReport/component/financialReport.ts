import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  FinancialReportService,
  CreateFinancialReportDto,
  FinancialReport,
} from '../../../core/services/financialReport.service';

@Component({
  selector: 'app-financial-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './financialReport.html',
  styleUrls: ['./financialReport.css'],
})
export class FinancialReportsComponent implements OnInit {
  private router = inject(Router);
  private location = inject(Location);
  private reportsSvc = inject(FinancialReportService);

  // UI model
  reportType: 'income-statement' | 'balance-sheet' | 'cash-flow' = 'income-statement';
  period: 'current-month' | 'last-month' | 'this-quarter' | 'this-year' = 'current-month';
  format: 'pdf' | 'csv' | 'xlsx' = 'pdf';

  // flags
  loadingList = false;
  generating = false;

  recent: FinancialReport[] = [];
  errorMsg = '';

  ngOnInit(): void {
    this.fetchRecent();
  }

  // ⨉ button handler
  onClose() {
    // Go back if possible, else to dashboard
    if (history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  resetForm() {
    this.reportType = 'income-statement';
    this.period = 'current-month';
    this.format = 'pdf';
    this.errorMsg = '';
  }

  fetchRecent() {
    this.loadingList = true;
    this.reportsSvc.listReports().subscribe({
      next: (res) => {
        this.recent = res || [];
        this.loadingList = false;
      },
      error: (e) => {
        this.errorMsg = e?.error?.message || 'Failed to load reports';
        this.loadingList = false;
      },
    });
  }

  generateReport() {
    this.generating = true;
    const payload: CreateFinancialReportDto = {
      reportType: this.reportType,
      period: this.period,
      format: this.format,
    };

    this.reportsSvc.createReport(payload).subscribe({
      next: (created) => {
        this.generating = false;
        this.router.navigate(['/export'], {
          queryParams: {
            id: created?._id,
            type: this.reportType,
            period: this.period,
            format: this.format,
          },
        });
      },
      error: (e) => {
        this.generating = false;
        this.errorMsg = e?.error?.message || 'Could not create report';
      },
    });
  }

  openInExport(r: FinancialReport) {
    this.router.navigate(['/export'], {
      queryParams: {
        id: r._id,
        type: r.reportType,
        period: r.period,
        format: r.format,
      },
    });
  }

  deleteReport(r: FinancialReport) {
    if (!confirm('Delete this report entry?')) return;
    this.reportsSvc.deleteReport(r._id!).subscribe({
      next: () => this.fetchRecent(),
      error: (e) => (this.errorMsg = e?.error?.message || 'Delete failed'),
    });
  }
}
