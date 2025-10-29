import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  FinancialReportService,
  CreateFinancialReportDto,
  FinancialReport,
} from '../../../core/services/financialReport.service';
import { AuthService, User } from '@/app/core/services/auth.service';

@Component({
  selector: 'app-financial-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './financialreport.html',
  styleUrls: ['./financialreport.css'],
})
export class FinancialReportsComponent implements OnInit {
  private router = inject(Router);
  private location = inject(Location);
  private reportsSvc = inject(FinancialReportService);


    showIncome = false;
  showExpense = false;
  showBudget = false;
    user: User | null = null;


  // Sidebar toggle
  mobileNavOpen = false;

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


  constructor(
      public  auth: AuthService,
    ) {
      this.auth.currentUser$.subscribe(u => { this.user = u; });
      this.user = this.auth.getCurrentUser();
    }


  onClose() {
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


  get firstInitial(): string {
    const s = (this.user?.name || this.user?.email || 'U').trim();
    return s ? s[0].toUpperCase() : 'U';
  }
  get secondInitial(): string {
    const n = this.user?.name?.trim();
    if (!n) return '';
    const parts = n.split(/\s+/);
    return (parts[1]?.[0] ?? '').toUpperCase();
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


  //Sidebar methods

    toggleMobileNav(): void {
    this.mobileNavOpen = !this.mobileNavOpen;
    this.lockScroll(this.mobileNavOpen);
  }
  closeMobileNav(): void {
    this.mobileNavOpen = false;
    this.lockScroll(false);
  }
  closeMobileNavIfSmall(): void {
    if (window.innerWidth <= 1024) this.closeMobileNav();
  }

  private lockScroll(lock: boolean) {
    try { document.body.style.overflow = lock ? 'hidden' : ''; } catch {}
  }

   openIncome()  { this.showIncome = true;  this.showExpense = false; this.showBudget = false; }
  openExpense() { this.showExpense = true; this.showIncome  = false; this.showBudget = false; }
  closeIncome() { this.showIncome = false; }
  closeExpense(){ this.showExpense = false; }
  openBudget()  { this.showBudget = true;  this.showIncome = false; this.showExpense = false; }
  closeBudget() { this.showBudget = false; }

}
