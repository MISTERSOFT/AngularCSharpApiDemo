import { computed, Injectable, signal } from '@angular/core';
import { AUTH_TOKEN_KEY } from '@app/core/constants';
import { AbstractBaseApiService } from '@app/core/http';
import { catchError, Observable, tap } from 'rxjs';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  expireAt: string;
  user: UserDto;
}

export interface UserDto {
  id: string;
  email: string;
  lastName: string;
  firstName: string;
  createdAt: string;
  userName: string;
  roles: string[];
}


@Injectable({
  providedIn: 'root',
})
export class AuthService extends AbstractBaseApiService {
  readonly controllerUrl = `${this.baseUrl}/auth`;

  private userSignal = signal<UserDto | null>(null);
  private tokenSignal = signal<string | null>(null);

  /**
   * Current authenticated user (read-only)
   */
  readonly user = this.userSignal.asReadonly();

  /**
   * Authentication token (read-only)
   */
  readonly token = this.tokenSignal.asReadonly();

  /**
   * Check if user is authenticated
   */
  readonly isAuthenticated = computed(() => !!this.tokenSignal());

  /**
   * Check if user has admin role
   */
  readonly isAdmin = computed(() => {
    const user = this.userSignal();
    return user?.roles?.includes('Admin') ?? false;
  });

  constructor() {
    super();
    this.loadTokenFromStorage();
  }

  /**
   * Login user with email and password
   */
  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.controllerUrl}/login`, credentials).pipe(
      tap(response => {
        this.setAuthData(response.token, response.user);
      })
    );
  }

  /**
   * Register new user with email and password
   */
  register(credentials: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.controllerUrl}/register`, credentials).pipe(
      tap(response => {
        this.setAuthData(response.token, response.user);
      })
    );
  }

  /**
   * Logout user and clear authentication data
   */
  logout(): void {
    this.clearAuthData();
  }

  /**
   * Get current authentication token
   */
  getToken(): string | null {
    return this.tokenSignal();
  }

  /**
   * Fetch current user data from backend using existing token
   */
  getCurrentUser(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.controllerUrl}/me`).pipe(
      tap(user => {
        this.userSignal.set(user);
      }),
      catchError(error => {
        console.error('Failed to fetch current user', error);
        // If token is invalid or expired, clear auth data
        this.clearAuthData();
        throw error;
      })
    );
  }

  /**
   * Set authentication data (token and user)
   */
  private setAuthData(token: string, user: UserDto): void {
    this.tokenSignal.set(token);
    this.userSignal.set(user);
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  /**
   * Clear authentication data
   */
  private clearAuthData(): void {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  /**
   * Load token from local storage on initialization
   */
  private loadTokenFromStorage(): void {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      this.tokenSignal.set(token);
      // Fetch user data from backend using the stored token
      this.getCurrentUser().subscribe({
        next: () => {
          console.log('User data loaded successfully');
        },
        error: (error) => {
          console.error('Failed to load user data, token may be invalid or expired', error);
        }
      });
    }
  }
}
