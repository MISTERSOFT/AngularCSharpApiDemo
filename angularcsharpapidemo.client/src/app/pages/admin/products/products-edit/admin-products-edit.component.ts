import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { extractResponseErrors } from '@app/core/utils';
import { CategoriesService, ProductsService } from '@app/services';
import { CategoryDto, CreateProductDto, UpdateProductDto } from '@app/types';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucidePlus, lucideX } from '@ng-icons/lucide';
import { catchError, EMPTY, finalize, forkJoin, of } from 'rxjs';

/**
 * Admin product edit/create component
 * Handles both creating new products and editing existing ones
 */
@Component({
  selector: 'app-admin-products-edit',
  standalone: false,
  templateUrl: './admin-products-edit.component.html',
  viewProviders: [provideIcons({ lucideCheck, lucideX, lucidePlus })]
})
export class AdminProductsEditComponent implements OnInit, OnDestroy {
  private readonly _productsService = inject(ProductsService);
  private readonly _categoriesService = inject(CategoriesService);
  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private _timeoutId: any | null = null;

  /**
   * The product form
   */
  productForm!: FormGroup;

  /**
   * Product ID (null if creating new product)
   */
  productId: number | null = null;

  /**
   * Available categories for selection
   */
  availableCategories: CategoryDto[] = [];

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
    return this.productId !== null;
  }

  /**
   * Get page title based on mode
   */
  get pageTitle(): string {
    return this.isEditMode ? 'Edit Product' : 'Create Product';
  }

  /**
   * Get submit button text based on mode
   */
  get submitButtonText(): string {
    return this.isEditMode ? 'Update Product' : 'Create Product';
  }

  /**
   * Get image URLs form array
   */
  get imageUrls(): FormArray {
    return this.productForm.get('imageUrls') as FormArray;
  }

  ngOnInit(): void {
    // Initialize form
    this.productForm = this._fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1000)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      categoryIds: [[], [Validators.required]],
      imageUrls: this._fb.array([])
    });

    // Load categories and product data if editing
    this.loadData();
  }

  ngOnDestroy() {
    this._timeoutId && clearTimeout(this._timeoutId);
  }

  /**
   * Load categories and product data
   */
  loadData(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this.productId = parseInt(id, 10);
    }

    // Load categories and product (if editing)
    const categories$ = this._categoriesService.getCategories();
    const product$ = this.productId
      ? this._productsService.getProduct(this.productId)
      : of(null);

    forkJoin({ categories: categories$, product: product$ }).pipe(
      catchError((error) => {
        this.errorMessage.set('Failed to load data. Please try again.');
        console.error('Load data error:', error);
        return of({ categories: [], product: null });
      }),
      finalize(() => this.isLoading.set(false))
    ).subscribe(({ categories, product }) => {
      this.availableCategories = categories;

      if (product) {
        // Populate form with product data
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          categoryIds: product.categories.map(c => c.id)
        });

        // Add existing image URLs
        product.productImages.forEach(img => {
          this.addImageUrl(img.url);
        });
      } else {
        // Add one empty image URL field for new products
        this.addImageUrl('');
      }
    });
  }

  /**
   * Add a new image URL field
   */
  addImageUrl(url: string = ''): void {
    this.imageUrls.push(this._fb.control(url, [Validators.required, Validators.pattern(/^https?:\/\/.+/)]));
  }

  /**
   * Remove an image URL field
   */
  removeImageUrl(index: number): void {
    this.imageUrls.removeAt(index);
  }

  /**
   * Submit the form (create or update)
   */
  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (this.isEditMode) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }

  /**
   * Create a new product
   */
  private createProduct(): void {
    const createDto: CreateProductDto = {
      name: this.productForm.value.name,
      description: this.productForm.value.description,
      price: this.productForm.value.price,
      categoryIds: this.productForm.value.categoryIds,
      imageUrls: this.productForm.value.imageUrls.filter((url: string) => url.trim() !== '')
    };

    this._productsService.createProduct(createDto).pipe(
      catchError((error) => {
        const messages: string[] = extractResponseErrors(error, 'Failed to create product. Please try again.')
        messages.forEach(msg => this.errorMessage.set(msg));
        console.error('Create product error:', error);
        return of(null);
      }),
      finalize(() => this.isSaving.set(false))
    ).subscribe((product) => {
      if (product) {
        this.successMessage.set('Product created successfully! You will be redirected in 3s...');
        this._timeoutId = setTimeout(() => {
          this._router.navigate(['/admin/products']);
        }, 3000);
      }
    });
  }

  /**
   * Update an existing product
   */
  private updateProduct(): void {
    if (!this.productId) return;

    const updateDto: UpdateProductDto = {
      name: this.productForm.value.name,
      description: this.productForm.value.description,
      price: this.productForm.value.price,
      categoryIds: this.productForm.value.categoryIds,
      imageUrls: this.productForm.value.imageUrls.filter((url: string) => url.trim() !== '')
    };

    this._productsService.updateProduct(this.productId, updateDto).pipe(
      catchError((error) => {
        const messages: string[] = extractResponseErrors(error, 'Failed to update product. Please try again.');
        messages.forEach(msg => this.errorMessage.set(msg));
        console.error('Update product error:', error);
        return EMPTY;
      }),
      finalize(() => this.isSaving.set(false))
    ).subscribe({
      next: () => {
        this.successMessage.set('Product updated successfully! You will be redirected in 3s...');
        this._timeoutId = setTimeout(() => {
          this._router.navigate(['/admin/products']);
        }, 3000);
      }
    });
  }

  /**
   * Cancel and go back to products list
   */
  cancel(): void {
    this._router.navigate(['/admin/products']);
  }

  /**
   * Check if a form field has an error
   */
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }

  /**
   * Check if an array field has an error
   */
  hasArrayError(arrayName: string, index: number, errorType: string): boolean {
    const array = this.productForm.get(arrayName) as FormArray;
    const control = array.at(index);
    return !!(control && control.hasError(errorType) && (control.dirty || control.touched));
  }

  /**
   * Get error message for a field
   */
  getErrorMessage(fieldName: string): string {
    const field = this.productForm.get(fieldName);
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
    if (field.hasError('min')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors?.['min'].min}`;
    }
    return '';
  }

  /**
   * Toggle category selection
   */
  toggleCategory(categoryId: number): void {
    const currentIds: number[] = this.productForm.value.categoryIds || [];
    const index = currentIds.indexOf(categoryId);

    if (index > -1) {
      // Remove category
      this.productForm.patchValue({
        categoryIds: currentIds.filter(id => id !== categoryId)
      });
    } else {
      // Add category
      this.productForm.patchValue({
        categoryIds: [...currentIds, categoryId]
      });
    }
  }

  /**
   * Check if category is selected
   */
  isCategorySelected(categoryId: number): boolean {
    const currentIds: number[] = this.productForm.value.categoryIds || [];
    return currentIds.includes(categoryId);
  }
}
