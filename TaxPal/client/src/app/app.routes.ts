import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { TaxEstimatorComponent } from './components/Tax-Estimator/tax-estimator.component';
import { TaxCalendarComponent } from './components/Tax-Calendar/tax-calendar.component';
import { ExportDownloadComponent } from './components/export-download/export-download.component';
import { TransactionComponent } from './components/transactions/transaction.component';

// Define the routes
export const routes: Routes = [
  // Root route goes to home
  { path: '', component: HomeComponent },

  // Home page route
  { path: 'home', component: HomeComponent },

  // User dashboard routes
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'transactions', component: TransactionComponent },
  {
    path: 'budget',
    loadComponent: () =>
      import('./components/budget/budget.component').then((m) => m.BudgetComponent),
    canActivate: [AuthGuard],
  },
  { path: 'reports', loadComponent: () => import('./components/export-download/export-download.component').then(m => m.ExportDownloadComponent) },

  // Tax Estimator route
  {
    path: 'tax-estimator',
    component: TaxEstimatorComponent,
    title: 'Tax Estimator - TaxPal',
  },
  {
    path: 'reports',
    component: ExportDownloadComponent,
    title: 'Export Reports - TaxPal',
  },

  // Tax Calendar route
  {
    path: 'tax-calendar',
    component: TaxCalendarComponent,
    title: 'Tax Calendar - TaxPal',
  },

  // Profile settings route
  {
    path: 'profile-settings',
    component: ProfileSettingsComponent,
    title: 'Profile Settings - TaxPal',
    canActivate: [AuthGuard],
  },

  // Redirect to home for any unknown routes
  { path: '**', redirectTo: '' },
];
