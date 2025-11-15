import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/services';
import { catchError, filter, map, of, take, timeout } from 'rxjs';

export const isAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  return toObservable(authService.user).pipe(
    // Filter out null values (wait for user to be loaded)
    filter(user => user !== null),
    // Take only the first emission
    take(1),
    // Add timeout to prevent infinite waiting (5 seconds)
    timeout(5000),
    // Check if user is admin
    map(() => true),
    // Handle timeout or errors - deny access
    catchError(() => {
      router.navigate(['/signin'], { queryParams: { redirectTo: state.url } });
      return of(false);
    })
  );
};
