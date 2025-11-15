import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideLock, lucideMail } from '@ng-icons/lucide';
import { svglGoogle } from '@ng-icons/svgl';
import { AuthService, LoginDto } from 'app/services';

@Component({
  selector: 'app-signin',
  standalone: false,
  templateUrl: './signin.component.html',
  viewProviders: [provideIcons({ lucideMail, lucideLock, svglGoogle })]
})
export class SigninComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private _route = inject(ActivatedRoute)

  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    // Set default credentials to easy try the login system.
    this.loginForm = this.fb.group({
      email: ['admin@app.fr', [Validators.required, Validators.email]],
      password: ['Azerty123!', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Get email form control for template access
   */
  get email() {
    return this.loginForm.get('email');
  }

  /**
   * Get password form control for template access
   */
  get password() {
    return this.loginForm.get('password');
  }

  /**
   * Handle login form submission
   */
  onSubmit(): void {
    // Clear previous error
    this.errorMessage.set(null);

    // Check if form is valid
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // Get form values
    const credentials: LoginDto = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    // Set loading state
    this.isLoading.set(true);

    // Call login service
    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        console.log('Login successful', response);
        // Navigate to home page or dashboard
        const redirectTo = this._route.snapshot.queryParamMap.get('redirectTo') || '/'
        this.router.navigate([redirectTo]);
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Login failed', error);
        this.errorMessage.set(
          error.error?.message || 'Login failed. Please check your credentials and try again.'
        );
      }
    });
  }
}
