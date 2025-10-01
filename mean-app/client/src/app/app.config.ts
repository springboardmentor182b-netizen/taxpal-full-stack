import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { withRouterConfig } from '@angular/router';

import { AuthService } from './features/auth.service';
import { ThemeService } from './core/service/theme.service';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

// Eagerly loaded components
import { Dashboard } from './features/dashboard/dashboard/dashboard.component';
import { LoginComponent } from './features/login/login.component';
import { BudgetFormComponent } from './features/budget/budget-form/budget-form.component';

// ---------------------------
// Define routes once
// ---------------------------
export const appRoutes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' as const },

  { path: 'login', component: LoginComponent },
  { path: 'signup', loadComponent: () => import('./features/signup/signup.component').then(m => m.SignupComponent) },
  { path: 'forgot-password', loadComponent: () => import('./features/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password/:token', loadComponent: () => import('./features/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },

  { path: 'dashboard', component: Dashboard },
  { path: 'dashboard-form', loadComponent: () => import('./features/dashboard-form/dashboard-form/dashboard-form.component').then(m => m.DashboardForm) },
  { path: 'budgets', component: BudgetFormComponent },
  { path: '**', redirectTo: '/login' }
];
// ---------------------------
// Application configuration
// ---------------------------
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      appRoutes,
      withRouterConfig({ onSameUrlNavigation: 'reload' })   // ✅ correct way
    ),
    provideHttpClient(withInterceptorsFromDi()),

    importProvidersFrom(
      BrowserModule,
      CommonModule,
      FormsModule,
      ReactiveFormsModule
    ),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthService,
    ThemeService
  ]
};
