import { toObservable } from '@angular/core/rxjs-interop';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/services';
import { AUTH_TOKEN_KEY } from '@app/core/constants';
import { map, filter, take, timeout, catchError, of } from 'rxjs';

/**
 * Guard to protect routes that require admin role access.
 *
 * This guard checks if:
 * 1. User is authenticated
 * 2. User has the 'Admin' role
 *
 * If a token exists in localStorage but user data is not yet loaded,
 * the guard waits for the user data to be fetched before checking admin status.
 *
 * If either condition fails, user is redirected to the home page.
 *
 * @example
 * // In routing configuration
 * {
 *   path: 'admin',
 *   loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule),
 *   canActivate: [adminOnlyGuard]
 * }
 */
export const adminOnlyGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if token exists in localStorage
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  // If no token exists, immediately deny access
  if (!token) {
    router.navigate(['/']);
    return false;
  }

  // If user data is already loaded, check immediately
  const currentUser = authService.user();
  if (currentUser !== null) {
    return checkAdminAccess(authService, router);
  }

  // Token exists but user data not loaded yet - wait for it
  // Convert user signal to observable and wait for non-null value
  return toObservable(authService.user).pipe(
    // Filter out null values (wait for user to be loaded)
    filter(user => user !== null),
    // Take only the first emission
    take(1),
    // Add timeout to prevent infinite waiting (5 seconds)
    timeout(5000),
    // Check if user is admin
    map(() => checkAdminAccess(authService, router)),
    // Handle timeout or errors - deny access
    catchError(() => {
      router.navigate(['/']);
      return of(false);
    })
  );
};

/**
 * Helper function to check if user has admin access
 */
function checkAdminAccess(authService: AuthService, router: Router): boolean {
  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    router.navigate(['/']);
    return false;
  }

  // Check if user has admin role
  if (!authService.isAdmin()) {
    router.navigate(['/']);
    return false;
  }

  // User is authenticated and is an admin, allow access
  return true;
}
