import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/services';

/**
 * Auth Guard - Prevents authenticated users from accessing some pages like signin/signup.
 *
 * This guard checks if a user is already logged in. If they are authenticated,
 * they will be redirected to the home page. This prevents logged-in users from
 * accessing authentication pages (signin, signup) unnecessarily.
 *
 * @returns true if user is NOT authenticated (allows access)
 * @returns false if user IS authenticated (blocks access and redirects to home)
 */
export const denyIfAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (authService.isAuthenticated()) {
    // User is logged in, redirect to home page
    console.log('User is already authenticated, redirecting to home');
    router.navigate(['/']);
    return false;
  }

  // User is not logged in, allow access to signin/signup pages
  return true;
};
