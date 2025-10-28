// src/app/features/tax-estimator/tax-estimator-form/tax-estimator-form.component.ts

import { Component, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../../../features/auth.service';
import { TaxEstimatorService, TaxEstimateRequest, TaxEstimateResponse, TaxReminder } from '../../../services/tax-estimator.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

interface Reminder {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'payment' | 'reminder';
}

interface MonthData {
  month: string;
  reminders: Reminder[];
}

interface TaxForm {
  country: string;
  state: string;
  filingStatus: string;
  quarter: string;
  grossIncome: number;
  deductions: number;
  retirementContributions: number;
  healthInsurancePremiums: number;
  homeOfficeDeduction: number;
  calculatedTax: number;
  estimateId?: string;
}

@Component({
  selector: 'app-tax-estimator-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tax-estimator-form.component.html',
  styleUrls: ['./tax-estimator-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaxEstimatorFormComponent implements OnInit {
  // Signals
  currentActivePage = signal('tax-estimator');
  currentActiveView = signal<'calculator' | 'calendar'>('calculator');
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  
  //toggle button
  collapsed: boolean = false;
  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
  }
  
  // Tax form state
  taxForm = signal<TaxForm>({
    country: 'United States',
    state: 'California',
    filingStatus: 'Single',
    quarter: 'Q2 (Apr-Jun)',
    grossIncome: 0,
    deductions: 0,
    retirementContributions: 0,
    healthInsurancePremiums: 0,
    homeOfficeDeduction: 0,
    calculatedTax: 0
  });

  states = ['California', 'Texas', 'New York'];
  filingStatuses = ['Single', 'Married Filing Jointly', 'Married Filing Separately'];
  quarters = ['Q1 (Jan-Mar)', 'Q2 (Apr-Jun)', 'Q3 (Jul-Sep)', 'Q4 (Oct-Dec)'];
  // Tax calendar data
  taxCalendar = signal<MonthData[]>([]);

  // Current user
  currentUser: User | null = null;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private taxEstimatorService: TaxEstimatorService
  ) {
    this.loadCurrentUser();
  }

  // Mark a reminder as paid (payment_done)
  markReminderDone(reminderId: string) {
    if (!reminderId) {
      console.error('No reminder ID provided');
      return;
    }

    // Clear any previous messages
    this.errorMessage.set(null);
    this.successMessage.set(null);

    // If it's already marked payment in the UI, do nothing
    const flat = this.taxCalendar().flatMap(m => m.reminders);
    const existing = flat.find(r => r.id === reminderId);
    
    if (!existing) {
      console.error('Reminder not found:', reminderId);
      this.errorMessage.set('Reminder not found. Please refresh and try again.');
      return;
    }

    if (existing.type === 'payment') {
      console.log('Reminder already marked as paid:', reminderId);
      return;
    }

    // Optimistic UI update: set the reminder locally to 'payment' type so UI responds instantly
    const previousCalendar = this.taxCalendar();
    const optimistic = previousCalendar.map(month => ({
      ...month,
      reminders: month.reminders.map(r => 
        r.id === reminderId 
          ? { ...r, type: 'payment' } as Reminder 
          : r
      )
    }));

    this.taxCalendar.set(optimistic);
    this.isLoading.set(true);

    this.taxEstimatorService.updateReminderStatus(reminderId, 'payment_done')
      .pipe(
        catchError(err => {
          console.error('Failed to mark reminder done:', err);
          // Revert optimistic change
          this.taxCalendar.set(previousCalendar);
          
          // Set appropriate error message based on error type
          if (err.status === 404) {
            this.errorMessage.set('Reminder not found. The page may be outdated, please refresh.');
          } else if (err.status === 401) {
            this.errorMessage.set('Session expired. Please login again.');
            this.router.navigate(['/login']);
          } else {
            this.errorMessage.set('Failed to mark reminder as paid. Please try again.');
          }
          return of(null);
        }),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          if (res) {
            // Update was successful
            this.successMessage.set('Reminder marked as paid successfully!');
            
            // Refresh calendar to get latest state from server
            this.loadTaxReminders();

            // Clear success message after delay
            setTimeout(() => this.successMessage.set(null), 2500);
          }
        },
        error: (err) => {
          // This catches any errors not caught in the catchError operator
          console.error('Unexpected error:', err);
          this.errorMessage.set('An unexpected error occurred. Please try again.');
        }
      });
  }
  
  ngOnInit(): void {
    this.loadTaxReminders();
  }

  // ----- Methods -----
  activePage() {
    return this.currentActivePage();
  }

  activeView() {
    return this.currentActiveView();
  }

  setActiveView(view: 'calculator' | 'calendar') {
    this.currentActiveView.set(view);
  }

  updateFormField(field: keyof TaxForm, value: any) {
    const numericFields = ['grossIncome', 'deductions', 'retirementContributions', 'healthInsurancePremiums', 'homeOfficeDeduction'];
    const finalValue = numericFields.includes(field as string) ? Number(value) : value;
    this.taxForm.update(form => ({ ...form, [field]: finalValue }));
  }

  calculateTax() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.errorMessage.set(null);
    this.successMessage.set(null);
    const form = this.taxForm();

    // Client-side guard: ensure user provided some numeric input before calling API
    const anyPositive = (form.grossIncome > 0) || (form.deductions > 0) || (form.retirementContributions > 0) || (form.healthInsurancePremiums > 0) || (form.homeOfficeDeduction > 0);
    if (!anyPositive) {
      this.errorMessage.set('Please enter income or deductions before calculating an estimate.');
      return;
    }

    this.isLoading.set(true);
    
    // Create request object
    const request: TaxEstimateRequest = {
      country: form.country,
      state: form.state,
      filing_status: form.filingStatus,
      quarter: form.quarter,
      gross_income_for_quarter: form.grossIncome,
      business_expenses: form.deductions,
      retirement_contribution: form.retirementContributions,
      health_insurance_premiums: form.healthInsurancePremiums,
      home_office_deduction: form.homeOfficeDeduction
    };
    
    // Call the API to calculate tax
    this.taxEstimatorService.createTaxEstimate(request)
      .pipe(
        catchError(error => {
          console.error('Error calculating tax:', error);
          this.errorMessage.set('Failed to calculate tax. Please try again.');
          return of(null);
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe(response => {
        if (response) {
          // Update the form with the calculated tax
          this.taxForm.update(f => ({ 
            ...f, 
            calculatedTax: response.estimated_tax,
            estimateId: response._id
          }));
          this.successMessage.set('Tax estimate calculated and saved successfully!');
          
          // Refresh reminders after calculation
          this.loadTaxReminders();
        }
      });
  }



  taxSummaryMessage() {
    const tax = this.taxForm().calculatedTax;
    if (tax > 0) return `Your estimated quarterly tax obligation is:`;
    return `Enter your income and deduction details to calculate your estimated quarterly tax.`;
  }

  loadTaxReminders() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.isLoading.set(true);
    this.taxEstimatorService.getTaxReminders()
      .pipe(
        catchError(error => {
          console.error('Error loading reminders:', error);
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
          return of([]);
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe(reminders => {
        if (!reminders || reminders.length === 0) {
          this.taxCalendar.set([]);
          return;
        }

        // Group reminders by month
        const monthsMap = new Map<string, Reminder[]>();
          
        reminders.forEach(reminder => {
          // Parse date safely
          let reminderDate: Date | null = null;
          
          // Try due_date first, then fallback to date
          if (reminder.due_date) {
            reminderDate = new Date(reminder.due_date);
          } else if (reminder.date) {
            reminderDate = new Date(reminder.date);
          }

          // Skip invalid dates
          if (!reminderDate || isNaN(reminderDate.getTime())) {
            console.warn('Invalid or missing date for reminder:', reminder);
            return;
          }

          const monthName = reminderDate.toLocaleString('default', { month: 'long' });
          const year = reminderDate.getFullYear();
          const monthKey = `${monthName} ${year}`;

          if (!monthsMap.has(monthKey)) {
            monthsMap.set(monthKey, []);
          }

          // Format amount as currency if present
          const formattedAmount = reminder.amount 
            ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(reminder.amount)
            : '';

          // Determine title and description
          let title = 'Tax Reminder';
          let description = '';

          if (reminder.quarter && reminder.amount) {
            title = `${reminder.quarter} Tax Payment Due`;
            description = `Amount due: ${formattedAmount}`;
          } else if (reminder.quarter) {
            title = `${reminder.quarter} Tax Reminder`;
            description = `Quarterly tax reminder`;
          } else if (reminder.amount) {
            title = 'Tax Payment Due';
            description = `Amount due: ${formattedAmount}`;
          }

          // Map server fields to UI Reminder
          const mapped: Reminder = {
            id: reminder._id,
            date: reminderDate.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            }),
            title,
            description,
            type: reminder.status === 'payment_done' ? 'payment' : 'reminder'
          };

          // Add to the month's reminders
          const monthReminders = monthsMap.get(monthKey);
          if (monthReminders) {
            monthReminders.push(mapped);
          }
        });

        // Sort reminders within each month
        monthsMap.forEach(reminders => {
          reminders.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        });
          
        // Convert map to sorted array of MonthData
        const calendarData = Array.from(monthsMap.entries())
          .map(([month, reminders]) => ({ month, reminders }))
          .sort((a, b) => {
            const [monthA, yearA] = a.month.split(' ');
            const [monthB, yearB] = b.month.split(' ');
            const dateA = new Date(`${monthA} 1, ${yearA}`);
            const dateB = new Date(`${monthB} 1, ${yearB}`);
            return dateA.getTime() - dateB.getTime();
          });
          
        this.taxCalendar.set(calendarData);
      });
  }

  trackByMonth(index: number, month: MonthData): string {
    return month.month;
  }

  trackByReminderId(index: number, reminder: Reminder): string {
    return reminder.id;
  }

  loadCurrentUser(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUser = user;
    } else {
      this.router.navigate(['/login']);
    }
  }

  userInitials() {
    if (!this.currentUser) return '';
    return this.currentUser.fullName.split(' ').map(n => n[0]).join('');
  }

  mainHeader() {
    return 'Tax Estimator';
  }

  mainSubheader() {
    return 'Manage and calculate quarterly taxes';
  }

logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout error:', err);
        this.router.navigate(['/login']);
      },
    });
  }
};
  