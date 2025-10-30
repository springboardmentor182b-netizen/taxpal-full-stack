import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import {
  TaxCalendarService,
  TaxCalendarItem,
  TaxCalendarSection,
  TaxType,
} from '@/app/core/services/tax-calendar.service';
import { AuthService, User } from '@/app/core/services/auth.service';

/** Use the same Budgets list component as Dashboard */
import { BudgetsListComponent } from '../../../budgets/component/budgets-list.component';

@Component({
  selector: 'app-tax-calendar',
  standalone: true,
  imports: [CommonModule, DatePipe, NgFor, NgIf, RouterLink, RouterLinkActive, BudgetsListComponent],
  templateUrl: './tax-calendar.component.html',
  styleUrls: ['./tax-calendar.component.css'],
})
export class TaxCalendarComponent implements OnInit {
  constructor(
    private router: Router,
    private calendarSvc: TaxCalendarService,
    public auth: AuthService
  ) {
    this.auth.currentUser$.subscribe(u => (this.user = u));
    this.user = this.auth.getCurrentUser();
  }

  /* ===== Drawer / layout (parity with Dashboard) ===== */
  mobileNavOpen = false;
  user: User | null = null;

  // inline budgets panel state
  showIncome = false;
  showExpense = false;
  showBudget = false;

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
    if (e.key === 'Escape' && this.showBudget) this.closeBudget();
  }
  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 1024 && this.mobileNavOpen) this.closeMobileNav();
  }

  // Initials in avatar
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

  /* ===== Calendar data ===== */
  items: TaxCalendarItem[] = [];
  loading = true;
  error = '';
  bulkMsg = '';
  bulkBusy = false;

  private completingIds = new Set<string>();
  private deletingIds = new Set<string>();

  ngOnInit(): void { this.fetch(); }

  private fetch() {
    this.loading = true;
    this.error = '';
    this.calendarSvc.getItems().subscribe({
      next: (items) => {
        this.items = items;
        this.loading = false;
      },
      error: (err) => {
        console.error('[tax-calendar] failed to fetch items', err);
        this.error = 'Failed to fetch calendar items from server.';
        this.items = [];
        this.loading = false;
      }
    });
  }

  /* ===== Budgets modal (same module as Dashboard) ===== */
  openBudget()  { this.showBudget = true;  this.showIncome = false; this.showExpense = false; }
  closeBudget() { this.showBudget = false; }
  openBudgetsOnDashboard() {
    this.router.navigate(['/dashboard'], { queryParams: { budgets: 'open' } });
  }

  /* ===== Calendar helpers ===== */
  get sections(): TaxCalendarSection[] {
    return this.calendarSvc.groupByMonth(this.items);
  }
  badgeClass(t: TaxType) {
    return t === 'reminder' ? 'badge badge--reminder' : 'badge badge--payment';
  }
  isCompleting(id?: string) { return !!id && this.completingIds.has(id); }
  isDeleting(id?: string)   { return !!id && this.deletingIds.has(id); }

  onClose() { this.router.navigate(['/dashboard']); }
  goToEstimator() { this.router.navigate(['/tax-estimator']); }

  deleteAllReminders() {
    if (this.bulkBusy) return;
    if (!confirm('Delete ALL reminder events? This cannot be undone.')) return;

    this.bulkBusy = true;
    this.bulkMsg = 'Deleting reminder events...';

    this.calendarSvc.deleteAllReminders().subscribe({
      next: (count) => {
        this.items = this.items.filter(i => i.type !== 'reminder');
        this.bulkMsg = `Deleted ${count} reminder item${count === 1 ? '' : 's'}.`;
        this.bulkBusy = false;
        this.fetch();
      },
      error: (err) => {
        console.error('[tax-calendar] bulk delete failed', err);
        this.bulkMsg = 'Failed to delete reminders.';
        this.bulkBusy = false;
      }
    });
  }

  markComplete(item: TaxCalendarItem) {
    if (!item?._id) return;
    if (this.isCompleting(item._id)) return;
    if (!confirm('Mark this payment as completed? It will be removed.')) return;

    this.completingIds.add(item._id);
    this.calendarSvc.completePayment(item._id).subscribe({
      next: (ok) => {
        this.completingIds.delete(item._id!);
        if (ok) this.items = this.items.filter(i => i._id !== item._id);
        else {
          this.error = 'Failed to mark payment as complete.';
          setTimeout(() => (this.error = ''), 3000);
        }
      },
      error: (err) => {
        console.error('[tax-calendar] complete payment failed', err);
        this.completingIds.delete(item._id!);
        this.error = 'Failed to mark payment as complete.';
        setTimeout(() => (this.error = ''), 3000);
      }
    });
  }

  deleteReminder(item: TaxCalendarItem) {
    if (!item?._id) return;
    if (this.isDeleting(item._id)) return;
    if (!confirm('Delete this reminder?')) return;

    this.deletingIds.add(item._id);
    this.calendarSvc.deleteItem(item._id).subscribe({
      next: (ok) => {
        this.deletingIds.delete(item._id!);
        if (ok) this.items = this.items.filter(i => i._id !== item._id);
        else {
          this.error = 'Failed to delete reminder.';
          setTimeout(() => (this.error = ''), 3000);
        }
      },
      error: (err) => {
        console.error('[tax-calendar] delete reminder failed', err);
        this.deletingIds.delete(item._id!);
        this.error = 'Failed to delete reminder.';
        setTimeout(() => (this.error = ''), 3000);
      }
    });
  }
}
