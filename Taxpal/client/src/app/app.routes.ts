import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Default: go to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Public
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/components/login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/components/register/register.component')
        .then(m => m.RegisterComponent)
  },

  // Protected
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component')
        .then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./features/transactions/transactions.component')
        .then(m => m.TransactionsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'budgets',
    loadComponent: () =>
      import('./features/budgets/budgets.component')
        .then(m => m.BudgetsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'tax',
    loadComponent: () =>
      import('./features/tax/tax.component')
        .then(m => m.TaxComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./features/reports/reports.component')
        .then(m => m.ReportsComponent),
    canActivate: [authGuard]
  },
  // wherever your Routes[] are defined
{
  path: 'forgot-password',
  loadComponent: () => import('./features/auth/components/forgot-password/forgot-password.component')
    .then(m => m.ForgotPasswordComponent)
},
{
  path: 'reset-password',
  loadComponent: () => import('./features/auth/components/reset-password/reset-password.component')
    .then(m => m.ResetPasswordComponent)
},

  // Fallback: if unknown route, go to login
  { path: '**', redirectTo: 'login' }
];
