import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { extractResponseErrors } from '@app/core/utils';
import { CategoriesService } from '@app/services';
import { CreateCategoryDto, UpdateCategoryDto } from '@app/types';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideX } from '@ng-icons/lucide';
import { catchError, EMPTY, finalize, of } from 'rxjs';

/**
 * Admin category edit/create component
 * Handles both creating new categories and editing existing ones
 */
@Component({
  selector: 'app-admin-categories-edit',
  standalone: false,
  templateUrl: './admin-categories-edit.component.html',
  viewProviders: [provideIcons({ lucideCheck, lucideX })]
})
export class AdminCategoriesEditComponent implements OnInit, OnDestroy {
  private readonly _categoriesService = inject(CategoriesService);
  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private _timeoutId: any | null = null

  /**
   * The category form
   */
  categoryForm!: FormGroup;

  /**
   * Category ID (null if creating new category)
   */
  categoryId: number | null = null;

  /**
   * Loading state
   */
  isLoading = signal(false);

  /**
   * Saving state
   */
  isSaving = signal(false);

  /**
   * Error message
   */
  errorMessage = signal<string | null>(null);

  /**
   * Success message
   */
  successMessage = signal<string | null>(null);

  /**
   * Check if we're in edit mode
   */
  get isEditMode(): boolean {
    return this.categoryId !== null;
  }

  /**
   * Get page title based on mode
   */
  get pageTitle(): string {
    return this.isEditMode ? 'Edit Category' : 'Create Category';
  }

  /**
   * Get submit button text based on mode
   */
  get submitButtonText(): string {
    return this.isEditMode ? 'Update Category' : 'Create Category';
  }

  ngOnInit(): void {
    // Initialize form
    this.categoryForm = this._fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]]
    });

    // Check if we're editing an existing category
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this.categoryId = parseInt(id, 10);
      this.loadCategory();
    }
  }

  ngOnDestroy() {
    this._timeoutId && clearTimeout(this._timeoutId)
  }

  /**
   * Load category data for editing
   */
  loadCategory(): void {
    if (!this.categoryId) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this._categoriesService.getCategory(this.categoryId).pipe(
      catchError((error) => {
        this.errorMessage.set('Failed to load category. Please try again.');
        console.error('Load category error:', error);
        return of(null);
      }),
      finalize(() => this.isLoading.set(false))
    ).subscribe((category) => {
      if (category) {
        this.categoryForm.patchValue({
          name: category.name
        });
      }
    });
  }

  /**
   * Submit the form (create or update)
   */
  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (this.isEditMode) {
      this.updateCategory();
    } else {
      this.createCategory();
    }
  }

  /**
   * Create a new category
   */
  private createCategory(): void {
    const createDto: CreateCategoryDto = {
      name: this.categoryForm.value.name
    };

    this._categoriesService.createCategory(createDto).pipe(
      catchError((error) => {
        const messages: string[] = extractResponseErrors(error, 'Failed to create category. Please try again.')
        messages.forEach(msg => this.errorMessage.set(msg))
        console.error('Create category error:', error);
        return of(null);
      }),
      finalize(() => this.isSaving.set(false))
    ).subscribe((category) => {
      if (category) {
        this.successMessage.set('Category created successfully! You will be redirected in 3s...');
        this._timeoutId = setTimeout(() => {
          this._router.navigate(['/admin/categories']);
        }, 3000);
      }
    });
  }

  /**
   * Update an existing category
   */
  private updateCategory(): void {
    if (!this.categoryId) return;

    const updateDto: UpdateCategoryDto = {
      name: this.categoryForm.value.name
    };

    this._categoriesService.updateCategory(this.categoryId, updateDto).pipe(
      catchError((error) => {
        const messages: string[] = extractResponseErrors(error, 'Failed to update category. Please try again.')
        messages.forEach(msg => this.errorMessage.set(msg))
        console.error('Update category error:', error);
        return EMPTY
      }),
      finalize(() => this.isSaving.set(false))
    ).subscribe({
      next: () => {
        this.successMessage.set('Category updated successfully! You will be redirected in 3s...');
        this._timeoutId = setTimeout(() => {
          this._router.navigate(['/admin/categories']);
        }, 3000);
      }
    });
  }

  /**
   * Cancel and go back to categories list
   */
  cancel(): void {
    this._router.navigate(['/admin/categories']);
  }

  /**
   * Check if a form field has an error
   */
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.categoryForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }

  /**
   * Get error message for a field
   */
  getErrorMessage(fieldName: string): string {
    const field = this.categoryForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors?.['minlength'].requiredLength} characters`;
    }
    if (field.hasError('maxlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be less than ${field.errors?.['maxlength'].requiredLength} characters`;
    }
    return '';
  }
}
