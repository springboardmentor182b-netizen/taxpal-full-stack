import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
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
      import('./features/dashboard/component/dashboard.component')
        .then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./features/transactions/component/transactions.component')
        .then(m => m.TransactionsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'budgets',
    loadComponent: () =>
      import('./features/budgets/component/budgets.component')
        .then(m => m.BudgetsComponent),
    canActivate: [authGuard]
  },

// ✅ Settings → default to Categories (unchanged)
  { path: 'settings', redirectTo: 'settings/categories', pathMatch: 'full' },

  // ✅ NEW: Settings → Profile
  {
    path: 'settings/profile',
    loadComponent: () =>
      import('./features/settings/profile/component/profile')
        .then(m => m.SettingsProfileComponent),
    canActivate: [authGuard]
  },

  // ✅ Settings → Categories (existing)
  {
    path: 'settings/categories',
    loadComponent: () =>
      import('./features/settings/categories/component/categories')
        .then(m => m.SettingsCategoriesComponent),
    canActivate: [authGuard]
  },

  // ✅ Tax Estimator page
  {
    path: 'tax-estimator',
    loadComponent: () =>
      import('./features/tax/components/tax-estimator/tax-estimator.component')
        .then(m => m.TaxEstimatorComponent),
    canActivate: [authGuard]
  },

  // ✅ Tax Calendar page
  {
    path: 'tax-calendar',
    loadComponent: () =>
      import('./features/tax/components/tax-calender/tax-calendar.component')
        .then(m => m.TaxCalendarComponent),
    canActivate: [authGuard]
  },


  // ✅ Financial Reports (standalone component)
  {
    path: 'financial-reports',
    loadComponent: () =>
      import('./features/financialReport/component/financialReport')
        .then(m => m.FinancialReportsComponent),
    canActivate: [authGuard]
  },

  // ✅ Export / Download page (uses your ExportComponent)
  {
    path: 'export',
    loadComponent: () =>
      import('./features/export/component/export.component')
        .then(m => m.ExportComponent),
    canActivate: [authGuard]
  },

  // Auth flows
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/components/forgot-password/forgot-password.component')
        .then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/auth/components/reset-password/reset-password.component')
        .then(m => m.ResetPasswordComponent)
  },

  // Fallback
  { path: '**', redirectTo: 'login' }
];
