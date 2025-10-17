import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userEmail = localStorage.getItem('user_email');
    if (userEmail) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
