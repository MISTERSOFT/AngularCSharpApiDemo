import { Component, inject, OnDestroy, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideLock, lucideMail, lucideUser } from '@ng-icons/lucide';
import { svglGoogle } from '@ng-icons/svgl';
import { AuthService } from 'app/services';

/**
 * Custom validator to check if password and confirmPassword match
 */
export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  };
}

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  viewProviders: [provideIcons({ lucideUser, lucideMail, lucideLock, svglGoogle })]
})
export class SignupComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private _redirectTimeoutId: any | null = null

  signupForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  constructor() {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: passwordMatchValidator()
    });
  }

  ngOnDestroy() {
    this._redirectTimeoutId && clearTimeout(this._redirectTimeoutId)
  }

  /**
   * Get firstName form control for template access
   */
  get firstName() {
    return this.signupForm.get('firstName');
  }

  /**
   * Get lastName form control for template access
   */
  get lastName() {
    return this.signupForm.get('lastName');
  }

  /**
   * Get email form control for template access
   */
  get email() {
    return this.signupForm.get('email');
  }

  /**
   * Get password form control for template access
   */
  get password() {
    return this.signupForm.get('password');
  }

  /**
   * Get confirmPassword form control for template access
   */
  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }

  /**
   * Handle signup form submission
   */
  onSubmit(): void {
    // Clear previous messages
    this.errorMessage.set(null);
    this.successMessage.set(null);

    // Check if form is valid
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    // Get form values
    const credentials = {
      firstName: this.signupForm.value.firstName,
      lastName: this.signupForm.value.lastName,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password
    };

    // Set loading state
    this.isLoading.set(true);

    // Call register service
    this.authService.register(credentials).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        console.log('Registration successful', response);
        this.successMessage.set('Account created successfully! Redirecting to sign in...');

        // Redirect to home page after 3 seconds
        this._redirectTimeoutId = setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Registration failed', error);

        // Handle different error scenarios
        if (error.status === 400 && error.error?.errors) {
          // Validation errors from backend
          const errors = error.error.errors;
          const errorMessages = Object.values(errors).flat().join(', ');
          this.errorMessage.set(errorMessages);
        } else if (error.error?.message) {
          this.errorMessage.set(error.error.message);
        } else {
          this.errorMessage.set('Registration failed. Please try again.');
        }
      }
    });
  }
}
