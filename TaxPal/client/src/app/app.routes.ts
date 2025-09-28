import { Routes } from '@angular/router';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

export const routes: Routes = [
  // Root route goes to home, not directly to user-profile
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Home page route (we'll create this component)
  { path: 'home', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },

  // User dashboard routes
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'transactions', component: UserProfileComponent },
  { path: 'budget', loadComponent: () => import('./components/budget/budget.component').then(m => m.BudgetComponent) },
  { path: 'reports', component: UserProfileComponent },
  { path: 'tax-estimator', component: UserProfileComponent },

  // Add the profile settings route
  {
    path: 'profile-settings',
    loadComponent: () => import('./pages/profile-settings/profile-settings.component').then(m => m.ProfileSettingsComponent),
    title: 'Profile Settings - TaxPal'
  },
];
