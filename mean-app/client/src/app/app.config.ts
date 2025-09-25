import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './features/auth.service';
import { ThemeService } from './core/service/theme.service';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { BudgetFormComponent } from './features/budget/budget-form/budget-form.component';
import { Dashboard } from './features/dashboard/dashboard/dashboard.component';
import { LoginComponent } from './features/login/login.component';

//import { LayoutComponent } from './layout/layout.component';
export const appRoutes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'budgets', component: BudgetFormComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' as const}
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes), // ✅ use appRoutes here
    provideHttpClient(),

    // Traditional modules (if needed)
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      BrowserModule,
      CommonModule,
      FormsModule,
      ReactiveFormsModule
    ),

    // Interceptors & services
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthService,
    ThemeService
  ]
};