import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { SignupComponent } from './features/signup/signup.component';
import { AuthGuard } from './features/auth.guard';
import { MainLayout } from './layouts/layout/main-layout/main-layout';

export const routes: Routes = [
  // Default route - redirect to login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Authentication routes
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { 
    path: 'forgot-password', 
    loadComponent: () => import('./features/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  { 
    path: 'reset-password/:token', 
    loadComponent: () => import('./features/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },

  // Main application layout (protected by AuthGuard)
  {
    path: '',
    component: MainLayout,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then(m => m.Dashboard)
      },
      {
        path: 'dashboard-form',
        loadComponent: () => import('./features/dashboard-form/dashboard-form/dashboard-form.component').then(m => m.DashboardForm)
      },
      {
        path: 'income',
        loadComponent: () => import('./features/income/income-form/income-form.component').then(m => m.IncomeForm)
      },
      {
        path: 'expenses',
        loadComponent: () => import('./features/expenses/expenses-form/expenses-form.component').then(m => m.ExpensesForm)
      },
      {
        path: 'transactions',
        loadComponent: () => import('./features/transactions/transactions/transactions.component').then(m => m.TransactionsComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/reports-form/reports.component').then(m => m.ReportsComponent)
      },
      {
        path: 'budgets',
        loadComponent: () => import('./features/budget/budget-form/budget-form.component').then(m => m.BudgetFormComponent)
      },
      {
        path: 'tax-estimator',
        loadComponent: () => import('./features/tax-estimator/tax-estimator-form/tax-estimator-form.component').then(m => m.TaxEstimatorFormComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings/settings.component').then(m => m.Settings),
        children: [
          {
            path: 'profile',
            loadComponent: () => import('./features/settings/profile/profile').then(m => m.Profile)
          },
          {
            path: 'categories',
            loadComponent: () => import('./features/settings/categories/categories.component').then(m => m.Categories),
            runGuardsAndResolvers: 'always'
          },
          {
            path: 'notifications',
            loadComponent: () => import('./features/settings/notifications/notifications').then(m => m.Notifications)
          },
          {
            path: 'security',
            loadComponent: () => import('./features/settings/security/security').then(m => m.Security)
          },
          { path: '', redirectTo: 'profile', pathMatch: 'full' }
        ]
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Redirects for legacy routes (backward compatibility)
  { path: 'features/login', redirectTo: '/login' },
  { path: 'features/signup', redirectTo: '/signup' },
  { path: 'features/forgot-password', redirectTo: '/forgot-password' },
  { path: 'features/reset-password/:token', redirectTo: '/reset-password/:token' },

  // Wildcard route - redirect to login for unknown routes
  { path: '**', redirectTo: '/login' }
];
