import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';


interface TaxEvent {
  date: Date;
  title: string;
  description: string;
  type: 'deadline' | 'reminder' | 'payment' | 'filing';
  priority: 'high' | 'medium' | 'low';
  id?: string;      // DB id of saved estimate (if any)
  paid?: boolean;   // paid flag
}

@Component({
  selector: 'app-tax-calendar',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './tax-calendar.component.html',
  styleUrls: ['./tax-calendar.component.css']
})
export class TaxCalendarComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  currentDate = new Date();
  selectedDate: Date | null = null;
  currentMonth = new Date();

  taxEvents: TaxEvent[] = []; // will be filled from backend
  eventsLoading = false;
  eventsError = '';
  private apiUrl = environment.apiUrl || '/api';
  private taxEstimateSavedListener: any;

  constructor(private router: Router, private http: HttpClient) {
    // Initialize dark mode from localStorage if available
    const storedTheme = localStorage.getItem('darkMode');
    this.isDarkMode = storedTheme ? JSON.parse(storedTheme) : false;
    this.applyTheme();
  }

  ngOnInit() {
    // Load theme preference from localStorage if available
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'true';
      if (this.isDarkMode) {
        document.body.classList.add('dark-theme');
      }
    }

    this.fetchTaxEventsFromServer();

    this.taxEstimateSavedListener = (ev: any) => {
      try {
        const detail = ev.detail || {};

        // New: normalize many possible dueDate shapes
        const possibleDue = detail.dueDate ?? detail.due_date ?? detail.due;
        const parsedDue = this.getDateFromMaybe(possibleDue);
        let eventDate: Date;
        if (parsedDue) {
          eventDate = parsedDue;
        } else {
          const createdAt = detail.createdAt ? new Date(detail.createdAt) : new Date();
          eventDate = this.dueDateForQuarter(detail.quarter, createdAt);
        }

        const newEvent: TaxEvent = {
          id: detail.id, // Use id from event.Detail
          date: eventDate,
          title: `Estimated Tax (${detail.quarter || ''}) - ${this.formatCurrency(detail.estimatedTax || 0)}`,
          description: `Estimated tax: ${this.formatCurrency(detail.estimatedTax || 0)} — taxable income ${this.formatCurrency(detail.taxableIncome || 0)}`,
          type: 'payment',
          priority: 'high'
        };

        this.taxEvents = [newEvent, ...this.taxEvents].filter((v, i, a) =>
          i === a.findIndex(x => x.date.toDateString() === v.date.toDateString() && x.title === v.title)
        ).sort((a,b)=>a.date.getTime()-b.date.getTime());
      } catch (err) {
        this.fetchTaxEventsFromServer();
      }
    };
    window.addEventListener('taxEstimateSaved', this.taxEstimateSavedListener);
  }

  ngOnDestroy() {
    if (this.taxEstimateSavedListener) {
      window.removeEventListener('taxEstimateSaved', this.taxEstimateSavedListener);
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', JSON.stringify(this.isDarkMode));
    this.applyTheme();
  }

  private applyTheme() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  toggleProfileMenu(): void {
    // Implement profile menu toggle logic here
    console.log('Profile menu toggled');
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    // You might want to store theme preference in localStorage
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    // Apply theme to document body or root element if needed
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  navigateToEstimator() {
    this.router.navigate(['/tax-estimator']);
  }

  // Fetch saved tax estimates from backend and map to calendar events
  async fetchTaxEventsFromServer(): Promise<void> {
    this.eventsLoading = true;
    this.eventsError = '';
    const userId = localStorage.getItem('user_id') || '';

    // helper to map server estimates -> TaxEvent[]
    const mapEstimates = (estimates: any[]): TaxEvent[] => {
      const estimateEvents: TaxEvent[] = (Array.isArray(estimates) ? estimates : []).map(est => {
        const quarter = est.quarter || est.q || est.quarterName || 'Q2';
        const possible = est.dueDate ?? est.due_date ?? est.due ?? est.suggestedDueDate;
        const parsed = this.getDateFromMaybe(possible);
        let dueDate: Date;
        if (parsed) dueDate = parsed;
        else if (est.createdAt) dueDate = this.dueDateForQuarter(quarter, new Date(est.createdAt));
        else dueDate = this.dueDateForQuarter(quarter, new Date());
        const estTax = (est.estimatedTax ?? est.totalTax ?? (est.estimatedTax?.total)) || 0;

        return {
          id: est._id || est.id || undefined,
          paid: (est.paid === true) || (String(est.paid) === 'true') || false,
          date: dueDate,
          title: `Estimated Tax (${quarter}) - ${this.formatCurrency(estTax)}`,
          description: `Estimated tax ${this.formatCurrency(estTax)} for ${quarter}`,
          type: 'payment',
          priority: 'high'
        } as TaxEvent;
      });
      return estimateEvents;
    };

    try {
      if (!userId) {
        // No user — nothing to fetch
        this.taxEvents = [];
        this.eventsLoading = false;
        return;
      }

      // Only attempt the canonical user endpoint to avoid noisy 404s from other routes.
      const estimates = (await this.http.get<any[]>(`${this.apiUrl}/tax-estimator/user/${encodeURIComponent(userId)}`).toPromise()) ?? [];
      // Debug: log server response so we can inspect dueDate shape (open Console after reload)
      console.log('DEBUG: GET /tax-estimator/user response for', userId, estimates);
      if (!estimates || estimates.length === 0) {
        // No saved estimates found — show empty calendar (no noisy errors)
        this.taxEvents = [];
        this.eventsLoading = false;
        return;
      }

      // Map and filter out paid items (server authoritative)
      const mapped = mapEstimates(estimates);
      const unpaidMapped = mapped.filter(ev => !ev.paid);

      // Use only server-provided events; do not add fallback mock reminders silently
      this.taxEvents = unpaidMapped.sort((a, b) => a.date.getTime() - b.date.getTime());
      this.eventsLoading = false;
    } catch (error: any) {
      // Treat 404 as "no endpoint / no saved data" and avoid spamming console/network errors
      if (error && error.status === 404) {
        // Endpoint not present or no data — show empty list without verbose logging
        this.taxEvents = [];
        this.eventsLoading = false;
        return;
      }

      // For other errors, log once and show a friendly message
      console.error('Failed to fetch tax estimates for calendar:', error);
      this.eventsError = 'Failed to load upcoming tax events. Please try again later.';
      this.taxEvents = [];
      this.eventsLoading = false;
    }
  }

  // Helper that returns static reminders (unchanged events you had previously)
  private getStaticTaxReminders(): TaxEvent[] {
    // Removed hard-coded mockup reminders (W-2 and Tax Return) per request.
    // Keep this function returning an empty array so only real saved estimates are shown.
    return [];
  }

  private loadTaxEventsStaticFallback() {
    this.taxEvents = this.getStaticTaxReminders();
  }

  // Map quarter string to typical payment due date
  private dueDateForQuarter(quarter: string, referenceDate: Date): Date {
    const q = (quarter || 'Q2').toUpperCase();
    const year = referenceDate ? referenceDate.getFullYear() : new Date().getFullYear();
    switch (q) {
      case 'Q1': // Jan-Mar -> Apr 15 of same year
        return new Date(year, 3, 15);
      case 'Q2': // Apr-Jun -> Jun 15
        return new Date(year, 5, 15);
      case 'Q3': // Jul-Sep -> Sep 15
        return new Date(year, 8, 15);
      case 'Q4': // Oct-Dec -> Jan 15 of next year
        return new Date(year + 1, 0, 15);
      default:
        return new Date(year, 5, 15);
    }
  }

  private formatCurrency(value: number): string {
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(Number(value || 0));
    } catch {
      return `$${(value || 0).toFixed(2)}`;
    }
  }

  getDaysInMonth(date: Date): Date[] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: Date[] = [];
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }

    return days;
  }

  getEventsForDate(date: Date): TaxEvent[] {
    return this.taxEvents.filter((event) => event.date.toDateString() === date.toDateString());
  }

  isToday(date: Date): boolean {
    return date.toDateString() === this.currentDate.toDateString();
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentMonth.getMonth();
  }

  previousMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
  }

  selectDate(date: Date) {
    this.selectedDate = date;
  }

  getMonthName(): string {
    return this.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  estimateTax() {
    this.router.navigate(['/tax-estimator']);
  }

  loadTaxEvents(): void {
    // No longer used — kept for backward compatibility
    this.fetchTaxEventsFromServer();
  }

  hasEventType(date: Date, eventType: string): boolean {
    return this.taxEvents.some(
      (event) => event.date.toDateString() === date.toDateString() && event.type === eventType
    );
  }

  hasEventPriority(date: Date, priority: string): boolean {
    return this.taxEvents.some(
      (event) => event.date.toDateString() === date.toDateString() && event.priority === priority
    );
  }

  // Add method to mark an event/estimate as paid
  async markAsPaid(event: TaxEvent) {
    if (!event || (!event.id && !event.title)) return;

    // Optimistic UI update
    const prevEvents = [...this.taxEvents];
    event.paid = true;

    try {
      // Prefer POST with id in body
      const payload = { id: event.id };
      await this.http.post<any>(`${this.apiUrl}/tax-estimator/mark-paid`, payload).toPromise();

      // Remove paid event from upcoming list (or keep with paid flag depending on UX)
      this.taxEvents = this.taxEvents.filter(e => e.id !== event.id);

      // Optional: refetch to ensure server state is authoritative
      // await this.fetchTaxEventsFromServer();
    } catch (err) {
      console.error('Failed to mark estimate as paid:', err);
      // revert optimistic update
      this.taxEvents = prevEvents;
      // show user-friendly error
      this.eventsError = 'Failed to mark event as paid. Please try again.';
      setTimeout(() => this.eventsError = '', 4000);
    }
  }

  // helper to parse various date representations and validate
  private parseToDate(value: any): Date | null {
    if (!value && value !== 0) return null;
    if (value instanceof Date) {
      if (!isNaN(value.getTime())) return value;
      return null;
    }
    if (typeof value === 'number' && !isNaN(value)) {
      const d = new Date(Number(value));
      return isNaN(d.getTime()) ? null : d;
    }
    if (typeof value === 'string') {
      const s = value.trim().replace(/^['"]|['"]$/g, '');
      const d = new Date(s);
      if (!isNaN(d.getTime())) return d;
      const parts = s.split(/[-\/]/).map(p => parseInt(p, 10));
      if (parts.length === 3 && parts.every(n => !isNaN(n))) {
        const [y, m, day] = parts;
        const dd = new Date(y, m - 1, day);
        return isNaN(dd.getTime()) ? null : dd;
      }
    }
    return null;
  }

  // NEW helper: accept Mongo wrappers and common shapes and return Date|null
  private getDateFromMaybe(value: any): Date | null {
    if (value == null) return null;

    // If frontend already gave a Date-like object or ISO string/number
    const direct = this.parseToDate(value);
    if (direct) return direct;

    // Mongo-style: { $date: "2025-10-31T00:00:00.000Z" } or { $date: { $numberLong: "..." } }
    try {
      if (typeof value === 'object') {
        // {$date: "ISO"} or {$date: 169...}
        if (value.$date) {
          // value.$date might itself be object or string
          if (typeof value.$date === 'string' || typeof value.$date === 'number') {
            const p = this.parseToDate(value.$date);
            if (p) return p;
          } else if (typeof value.$date === 'object' && value.$date.$numberLong) {
            const num = Number(value.$date.$numberLong);
            const p = this.parseToDate(num);
            if (p) return p;
          }
        }
        // Sometimes drivers return { "$numberLong": "..." }
        if (value.$numberLong) {
          const num = Number(value.$numberLong);
          const p = this.parseToDate(num);
          if (p) return p;
        }
        // nested dueDate under other keys
        const nestedKeys = ['dueDate', 'due_date', 'due', 'suggestedDueDate'];
        for (const k of nestedKeys) {
          if (value[k]) {
            const p = this.getDateFromMaybe(value[k]);
            if (p) return p;
          }
        }
      }
    } catch (e) {
      // ignore and return null below
    }

    return null;
  }
}
