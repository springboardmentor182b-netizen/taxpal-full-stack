import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = sessionStorage.getItem('current_user') || localStorage.getItem('current_user');

  if (user) {
    return true; // allow navigation
  } else {
    router.navigate(['/login']); // redirect to login
    return false;
  }
};
