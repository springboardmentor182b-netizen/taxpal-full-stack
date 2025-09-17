
import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { SignupComponent } from './features/signup/signup.component';

export const routes: Routes = [
  { path: '', redirectTo: '/features/login', pathMatch: 'full' },
  { path: 'features/login', component: LoginComponent },
  { path: 'features/signup', component: SignupComponent },
  { path: '**', redirectTo: '/features/login' }
];