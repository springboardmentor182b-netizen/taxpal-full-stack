import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { TaxEstimatorComponent } from './components/Tax-Estimator/tax-estimator.component';
import { TaxCalendarComponent } from './components/Tax-Calendar/tax-calendar.component';
import { ExportDownloadComponent } from './components/export-download/export-download.component';
import { TransactionsComponent } from './components/transactions/transactions.component';

// Define the routes
export const routes: Routes = [
  // Root route goes to home
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Home page route
  { path: 'home', component: HomeComponent },

  // Dashboard route
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },

  // Transactions route
  { path: 'transactions', component: TransactionsComponent },

  // User profile routes
  { path: 'user-profile', component: UserProfileComponent },
  {
    path: 'profile-settings',
    component: ProfileSettingsComponent,
    title: 'Profile Settings - TaxPal',
  },

  // Tax-related routes
  { path: 'tax-estimator', component: TaxEstimatorComponent, title: 'Tax Estimator - TaxPal' },
  { path: 'tax-calendar', component: TaxCalendarComponent, title: 'Tax Calendar - TaxPal' },

  // Budget and reports routes
  {
    path: 'budget',
    loadComponent: () =>
      import('./components/budget/budget.component').then((m) => m.BudgetComponent),
  },
  {
    path: 'reports',
    component: ExportDownloadComponent,
    title: 'Export Reports - TaxPal',
  },

  // Catch-all route: redirect to home
  { path: '**', redirectTo: '/home' },
];
