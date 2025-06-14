import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const RoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['role'];
  const userRole = authService.getUserRole();

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if (Array.isArray(expectedRoles) && !expectedRoles.includes(userRole)) {
    router.navigate(['/']);
    return false;
  }

  if (!Array.isArray(expectedRoles) && userRole !== expectedRoles) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
