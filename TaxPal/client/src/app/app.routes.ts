import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';

// Define the routes
export const routes: Routes = [
  // Root route goes to home, not directly to user-profile
  { path: '', component: HomeComponent },

  // Home page route (we'll create this component)
  { path: 'home', component: HomeComponent },

  // User dashboard routes
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'transactions', component: UserProfileComponent },
  { path: 'budget', loadComponent: () => import('./components/budget/budget.component').then(m => m.BudgetComponent) },
  { path: 'reports', component: UserProfileComponent },
  { path: 'tax-estimator', component: UserProfileComponent },

  // Add the profile settings route
  {
    path: 'profile-settings',
    component: ProfileSettingsComponent,
    title: 'Profile Settings - TaxPal'
  },

  // Redirect to home for any unknown routes
  { path: '**', redirectTo: '' }
];
