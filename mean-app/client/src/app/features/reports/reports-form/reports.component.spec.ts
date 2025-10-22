import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportsService } from '../../../services/reports.service';
import { AuthService } from '../../../features/auth.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})

export class ReportsComponent implements OnInit {
  reportForm: FormGroup;
  isLoading = false;
  generatedReportUrl: string | null = null;
  showCustomPeriodPicker = false;
  availableReportTypes: string[] = [];

  recentReports: any[] = [];

  constructor(
    private fb: FormBuilder,
    private reportsService: ReportsService,
    private authService: AuthService
  )
  {
    this.reportForm = this.fb.group({
      reportType: [''],
      period: [''],
      format: ['']
    });
  }

  ngOnInit(): void {
    this.loadReportTypes();
  }

  loadReportTypes(): void {
    
    this.availableReportTypes = ['Income Statement', 'Balance Sheet'];
  }

  onGenerateReport(): void {
    this.isLoading = true;
    
    setTimeout(() => {
      this.generatedReportUrl = 'http://localhost:5000/reports/sample.pdf';
      this.isLoading = false;
    }, 500);
  }

  onCustomPeriodSelected(): void {
    this.showCustomPeriodPicker = true;
  }
}


