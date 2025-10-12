// src/app/features/tax-estimator/tax-estimator-form/tax-estimator-form.component.ts

import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../../../features/auth.service';

interface Reminder {
  id: number;
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
}

@Component({
  selector: 'app-tax-estimator-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tax-estimator-form.component.html',
  styleUrls: ['./tax-estimator-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaxEstimatorFormComponent {
  // Signals
  currentActivePage = signal('tax-estimator');
  currentActiveView = signal<'calculator' | 'calendar'>('calculator');
//tuggle button
collapsed: boolean = false;
  // ✅ Add this method
  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
  }
  // Tax form state
  taxForm = signal<TaxForm>({
    country: 'United States',
    state: 'California',
    filingStatus: 'Single',
    quarter: 'Q2 (Apr - Jun 2025)',
    grossIncome: 0,
    deductions: 0,
    retirementContributions: 0,
    healthInsurancePremiums: 0,
    homeOfficeDeduction: 0,
    calculatedTax: 0
  });

  states = ['California', 'Texas', 'New York'];
  filingStatuses = ['Single', 'Married Filing Jointly', 'Married Filing Separately'];
  quarters = ['Q1 (Jan - Mar 2025)', 'Q2 (Apr - Jun 2025)', 'Q3 (Jul - Sep 2025)', 'Q4 (Oct - Dec 2025)'];

  // Mock tax calendar data
  taxCalendar: MonthData[] = [
    { 
      month: 'June 2025', 
      reminders: [
        { id: 1, date: 'Jun 1, 2025', title: 'Reminder: Q2 Payment', description: 'Reminder for Q2 payment.', type: 'reminder' },
        { id: 2, date: 'Jun 15, 2025', title: 'Q2 Estimated Tax Payment', description: 'Q2 tax payment due.', type: 'payment' }
      ] 
    },
    { 
      month: 'September 2025', 
      reminders: [
        { id: 3, date: 'Sep 1, 2025', title: 'Reminder: Q3 Payment', description: 'Reminder for Q3 payment.', type: 'reminder' },
        { id: 4, date: 'Sep 15, 2025', title: 'Q3 Estimated Tax Payment', description: 'Q3 tax payment due.', type: 'payment' }
      ] 
    },
  ];

  // Current user
  currentUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.loadCurrentUser();
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
    const form = this.taxForm();
    const taxableIncome = form.grossIncome - form.deductions - form.retirementContributions - form.healthInsurancePremiums - form.homeOfficeDeduction;
    this.taxForm.update(f => ({ ...f, calculatedTax: taxableIncome > 0 ? taxableIncome * 0.25 : 0 }));
  }

  taxSummaryMessage() {
    const tax = this.taxForm().calculatedTax;
    if (tax > 0) return `Your estimated quarterly tax obligation is:`;
    return `Enter your income and deduction details to calculate your estimated quarterly tax.`;
  }

  trackByMonth(index: number, month: MonthData): string {
    return month.month;
  }

  trackByReminderId(index: number, reminder: Reminder): number {
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
  