import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { FinancialReportService } from '../../services/financial-report.service';
import { REPORT_TYPES, REPORT_FORMATS, REPORT_PERIODS } from '../../constants/report-options.constants';

@Component({
  selector: 'app-export-download',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
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
  message = '';

  constructor(private reportService: FinancialReportService) {}

  generateReport() {
    this.loading = true;
    this.message = '';

    const body = {
      userId: '12345', // 🔹 Replace with actual logged-in user ID later
      reportType: this.selectedReport,
      format: this.selectedFormat,
      period: this.selectedPeriod
    };

    this.reportService.generateReport(body).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.message = `✅ Report generated successfully (${res.report.reportType})`;
        } else {
          this.message = '⚠️ Report generation failed.';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error generating report:', err);
        this.message = '❌ Failed to generate report. Please try again.';
      }
    });
  }
}
