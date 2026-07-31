import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/shared/services/auth.service';

export function roleGuard(allowedRoles: string[]): CanActivateFn {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const user = authService.getCurrentUser();

    if (!user || !allowedRoles.includes(user.role)) {
      router.navigate(['/unauthorized']); // or wherever makes sense
      return false;
    }

    return true;
  };
}
