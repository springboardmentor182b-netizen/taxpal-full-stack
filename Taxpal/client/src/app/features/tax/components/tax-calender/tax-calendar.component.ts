import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

import {
  TaxCalendarService,
  TaxCalendarItem,
  TaxCalendarSection,
  TaxType,
} from '@/app/core/services/tax-calendar.service';

@Component({
  selector: 'app-tax-calendar',
  standalone: true,
  imports: [CommonModule, DatePipe, NgFor, NgIf],
  templateUrl: './tax-calendar.component.html',
  styleUrls: ['./tax-calendar.component.css'],
})
export class TaxCalendarComponent implements OnInit {
  constructor(private router: Router, private calendarSvc: TaxCalendarService) {}

  items: TaxCalendarItem[] = [];
  loading = true;
  error = '';
  bulkMsg = '';
  bulkBusy = false;

  // track per-item "completing" state
  private completingIds = new Set<string>();

  ngOnInit(): void {
    this.fetch();
  }

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

  get sections(): TaxCalendarSection[] {
    return this.calendarSvc.groupByMonth(this.items);
  }

  badgeClass(t: TaxType) {
    return t === 'reminder' ? 'badge badge--reminder' : 'badge badge--payment';
  }

  isCompleting(id?: string) {
    return !!id && this.completingIds.has(id);
  }

  onClose() {
    this.router.navigate(['/dashboard']);
  }

  goToEstimator() {
    this.router.navigate(['/tax-estimator']);
  }

  // ✅ NEW: Delete all reminders
  deleteAllReminders() {
    if (this.bulkBusy) return;
    if (!confirm('Delete ALL reminder events? This cannot be undone.')) return;

    this.bulkBusy = true;
    this.bulkMsg = 'Deleting reminder events...';

    this.calendarSvc.deleteAllReminders().subscribe({
      next: (count) => {
        // Optimistic local filter
        this.items = this.items.filter(i => i.type !== 'reminder');
        this.bulkMsg = `Deleted ${count} reminder item${count === 1 ? '' : 's'}.`;
        this.bulkBusy = false;
        // Optional: re-fetch to ensure perfect sync
        this.fetch();
      },
      error: (err) => {
        console.error('[tax-calendar] bulk delete failed', err);
        this.bulkMsg = 'Failed to delete reminders.';
        this.bulkBusy = false;
      }
    });
  }

  // ✅ NEW: Mark a payment as complete (delete it on server + remove from UI)
  markComplete(item: TaxCalendarItem) {
    if (!item?._id) return;
    if (this.isCompleting(item._id)) return;
    if (!confirm('Mark this payment as completed? It will be removed.')) return;

    this.completingIds.add(item._id);
    this.calendarSvc.completePayment(item._id).subscribe({
      next: (ok) => {
        this.completingIds.delete(item._id!);
        if (ok) {
          this.items = this.items.filter(i => i._id !== item._id);
        } else {
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
}
