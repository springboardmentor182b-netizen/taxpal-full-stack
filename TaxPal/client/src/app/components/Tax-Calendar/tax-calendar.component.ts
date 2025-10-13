import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaxService, TaxEvent } from '../../services/tax.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tax-calendar',
  templateUrl: './tax-calendar.component.html',
  styleUrls: ['./tax-calendar.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class TaxCalendarComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  currentDate = new Date();
  selectedDate: Date | null = null;
  currentMonth = new Date();
  taxEvents: TaxEvent[] = [];
  private eventsSubscription: Subscription | null = null;

  constructor(private router: Router, private taxService: TaxService) {
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

    // Subscribe to tax events from the service
    this.eventsSubscription = this.taxService.taxEvents$.subscribe((events) => {
      if (events && events.length > 0) {
        this.taxEvents = events;
      } else {
        this.loadTaxEvents();
      }
    });
  }

  ngOnDestroy() {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
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
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );
  }

  nextMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );
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
    this.taxService.getTaxReminders().subscribe({
      next: (events) => {
        // Convert string dates to Date objects
        this.taxEvents = events.map((event) => ({
          ...event,
          date: new Date(event.date),
        }));
      },
      error: (error) => {
        console.error('Error loading tax events:', error);
      },
    });
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
}
