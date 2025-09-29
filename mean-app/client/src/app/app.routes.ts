import { Routes } from '@angular/router';

import { LoginComponent } from './features/login/login.component';
import { SignupComponent } from './features/signup/signup.component';

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
  
  // Main application routes (lazy loaded for better performance)
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then(m => m.Dashboard)
  },
  { 
    path: 'dashboard-form', 
    loadComponent: () => import('./features/dashboard-form/dashboard-form/dashboard-form.component').then(m => m.DashboardForm)
  },
  
  { path: 'features/login', redirectTo: '/login' },
  { path: 'features/signup', redirectTo: '/signup' },
  { path: 'features/forgot-password', redirectTo: '/forgot-password' },
  { path: 'features/reset-password/:token', redirectTo: '/reset-password/:token' },
  
  // Wildcard route - redirect to login for any unknown routes
  { path: '**', redirectTo: '/login' }
];