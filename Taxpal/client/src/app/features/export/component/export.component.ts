import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ExportService, PreviewRequest } from '../../../core/services/export.service';
import { AuthService, User } from '../../../core/services/auth.service';
import { BudgetsListComponent } from '../../budgets/component/budgets-list.component'; // adjust path if different

@Component({
  selector: 'app-export',
  standalone: true,
  imports: [CommonModule, RouterLink, BudgetsListComponent],
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private exportSvc = inject(ExportService);
  private sanitizer = inject(DomSanitizer);

  // Make auth public so template can call auth.logout()
  public auth = inject(AuthService);

  // Sidebar / drawer state
  mobileNavOpen = false;

  // Budget modal
  showBudget = false;

  // user (for avatar + profile)
  user: User | null = null;

  // ======== existing export state ========
  id?: string;
  type: string = 'income-statement';
  period: string = 'current-month';
  format: 'pdf' | 'csv' | 'xlsx' = 'pdf';

  loading = true;
  errorMsg = '';

  // preview
  previewUrl?: SafeResourceUrl;
  previewFilename = 'report.pdf';
  previewable = true;

  constructor() {
    // hydrate current user
    this.auth.currentUser$.subscribe(u => (this.user = u));
    this.user = this.auth.getCurrentUser();
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.id = params.get('id') || undefined;
      this.type = (params.get('type') || 'income-statement');
      this.period = (params.get('period') || 'current-month');
      this.format = (params.get('format') as any) || 'pdf';
      this.loadPreview();
    });
  }

  /* ================= Drawer helpers (match Dashboard) ================= */
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
  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && this.mobileNavOpen) this.closeMobileNav();
  }
  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 1024 && this.mobileNavOpen) this.closeMobileNav();
  }

  // Avatar initials
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

  /* ================= Budget modal ================= */
  openBudget() { this.showBudget = true; }
  closeBudget() { this.showBudget = false; }

  /* ================= Export actions (existing) ================= */
  onClose() {
    if (history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/financial-reports']);
    }
  }

  loadPreview() {
    this.loading = true;
    const req: PreviewRequest = {
      id: this.id,
      reportType: this.type as any,
      period: this.period as any,
      format: this.format
    };
    this.exportSvc.preview(req).subscribe({
      next: (res) => {
        this.previewFilename = res.filename;
        if (res.mimeType === 'application/pdf' && res.base64) {
          const url = `data:${res.mimeType};base64,${res.base64}`;
          this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          this.previewable = true;
        } else {
          // No iframe preview for CSV/XLSX
          this.previewUrl = undefined;
          this.previewable = false;
        }
        this.loading = false;
      },
      error: (e) => {
        this.errorMsg = e?.error?.message || 'Failed to build preview';
        this.loading = false;
      }
    });
  }

  print() {
    if (!this.previewUrl) return;
    // open in new tab to print
    window.open((this.previewUrl as any).changingThisBreaksApplicationSecurity, '_blank');
  }

  download() {
    this.exportSvc.download({
      id: this.id,
      reportType: this.type as any,
      period: this.period as any,
      format: this.format
    }).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.previewFilename || `report.${this.format}`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: (e) => this.errorMsg = e?.error?.message || 'Download failed'
    });
  }
}
