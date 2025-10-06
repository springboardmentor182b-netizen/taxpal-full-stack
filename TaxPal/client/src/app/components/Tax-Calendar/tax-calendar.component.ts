import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// Import the ProfileNavbarComponent
import { ProfileNavbarComponent } from '../../components/navbar/profile-navbar.component';

interface TaxEvent {
  date: Date;
  title: string;
  description: string;
  type: 'deadline' | 'reminder' | 'payment' | 'filing';
  priority: 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-tax-calendar',
  templateUrl: './tax-calendar.component.html',
  styleUrls: ['./tax-calendar.component.css'], // Changed from .scss to .css
  standalone: true,
  // Add ProfileNavbarComponent to the imports array
  imports: [CommonModule, ProfileNavbarComponent],
})
export class TaxCalendarComponent implements OnInit {
  // Rest of your component code remains the same...
  isDarkMode = false;
  currentDate = new Date();
  selectedDate: Date | null = null;
  currentMonth = new Date();

  taxEvents: TaxEvent[] = [
    {
      date: new Date(2025, 3, 15), // April 15, 2025
      title: 'Tax Return Filing Deadline',
      description: 'Federal income tax returns are due',
      type: 'deadline',
      priority: 'high',
    },
    {
      date: new Date(2025, 0, 31), // January 31, 2025
      title: 'Form W-2 Deadline',
      description: 'Employers must provide W-2 forms to employees',
      type: 'deadline',
      priority: 'medium',
    },
    {
      date: new Date(2025, 2, 15), // March 15, 2025
      title: 'S-Corp Tax Return Due',
      description: 'S-Corporation tax returns are due',
      type: 'deadline',
      priority: 'medium',
    },
    {
      date: new Date(2025, 5, 15), // June 15, 2025
      title: 'Quarterly Payment Due',
      description: '2nd quarter estimated tax payment',
      type: 'payment',
      priority: 'high',
    },
    {
      date: new Date(2025, 3, 1), // April 1, 2025
      title: 'Tax Return Reminder',
      description: 'Remember to gather all documents for tax filing',
      type: 'reminder',
      priority: 'medium',
    },
    {
      date: new Date(2025, 8, 1), // September 1, 2025
      title: 'Q3 Tax Planning',
      description: 'Review Q3 financials for tax planning',
      type: 'reminder',
      priority: 'low',
    },
    {
      date: new Date(2025, 11, 15), // December 15, 2025
      title: 'Year-End Tax Planning',
      description: 'Schedule year-end tax planning session',
      type: 'reminder',
      priority: 'high',
    },
  ];

  constructor(private router: Router) {
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
    // Mock tax events data - in a real application, this would come from a service
    this.taxEvents = [
      {
        title: 'Quarterly Estimated Tax Payment',
        date: new Date(new Date().getFullYear(), 3, 15), // April 15
        description: 'First quarter estimated tax payment due for self-employed individuals.',
        type: 'payment',
        priority: 'high',
      },
      {
        title: 'Form 1040-ES Filing',
        date: new Date(new Date().getFullYear(), 3, 15), // April 15
        description: 'Deadline to file Form 1040-ES for quarterly estimated taxes.',
        type: 'filing',
        priority: 'medium',
      },
      {
        title: 'Tax Extension Deadline',
        date: new Date(new Date().getFullYear(), 9, 15), // October 15
        description: 'Extended deadline for filing individual income tax returns.',
        type: 'deadline',
        priority: 'high',
      },
      {
        title: 'Annual Tax Return Due',
        date: new Date(new Date().getFullYear(), 3, 15), // April 15
        description: 'Federal income tax return filing deadline for individuals.',
        type: 'filing',
        priority: 'high',
      },
      {
        title: 'Second Quarter Estimated Taxes',
        date: new Date(new Date().getFullYear(), 5, 15), // June 15
        description: 'Second quarter estimated tax payment due.',
        type: 'payment',
        priority: 'medium',
      },
      {
        title: 'Third Quarter Estimated Taxes',
        date: new Date(new Date().getFullYear(), 8, 15), // September 15
        description: 'Third quarter estimated tax payment due.',
        type: 'payment',
        priority: 'medium',
      },
      {
        title: 'Fourth Quarter Estimated Taxes',
        date: new Date(new Date().getFullYear() + 1, 0, 15), // January 15 of next year
        description: 'Fourth quarter estimated tax payment due.',
        type: 'payment',
        priority: 'medium',
      },
    ];
  }
}
