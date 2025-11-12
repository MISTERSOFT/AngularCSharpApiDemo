import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AUTH_TOKEN_KEY } from '@app/core/constants';
import { Observable } from 'rxjs';

/**
 * HTTP Interceptor that adds JWT token to all outgoing requests
 *
 * Note: This interceptor reads the token directly from localStorage
 * to avoid circular dependency issues (HttpClient → Interceptor → AuthService → HttpClient)
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Read token directly from localStorage to avoid circular dependency
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    // If we have a token, clone the request and add the Authorization header
    if (token) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(clonedRequest);
    }

    // If no token, proceed with the original request
    return next.handle(req);
  }
}
