import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { TaxEstimatorComponent } from './components/Tax-Estimator/tax-estimator.component';
import { TaxCalendarComponent } from './components/Tax-Calendar/tax-calendar.component';

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
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'transactions', component: UserProfileComponent },
  {
    path: 'budget',
    loadComponent: () =>
      import('./components/budget/budget.component').then((m) => m.BudgetComponent),
  },
  { path: 'reports', component: UserProfileComponent },

  // Tax Estimator route
  {
    path: 'tax-estimator',
    component: TaxEstimatorComponent,
    title: 'Tax Estimator - TaxPal',
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
  },

  // Redirect to home for any unknown routes
  { path: '**', redirectTo: '' },
];
