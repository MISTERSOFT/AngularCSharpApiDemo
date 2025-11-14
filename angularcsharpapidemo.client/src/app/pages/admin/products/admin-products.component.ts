import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '@app/services';
import { ProductDto } from '@app/types';
import { provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { catchError, finalize, of } from 'rxjs';

/**
 * Admin products list component
 * Displays all products in a table with edit and delete actions
 */
@Component({
  selector: 'app-admin-products',
  standalone: false,
  templateUrl: './admin-products.component.html',
  viewProviders: [provideIcons({ lucidePlus })]
})
export class AdminProductsComponent implements OnInit {
  private readonly _productsService = inject(ProductsService);

  /**
   * List of all products
   */
  products: ProductDto[] = [];

  /**
   * Loading state
   */
  isLoading = signal(false);

  /**
   * Pagination state
   */
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;
  hasPrevious = false;
  hasNext = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  /**
   * Load products from the backend with pagination
   */
  loadProducts(): void {
    this.isLoading.set(true);

    this._productsService.getProducts({
      pageNumber: this.currentPage,
      pageSize: this.pageSize
    }).pipe(
      catchError(() => of({
        items: [] as ProductDto[],
        pageNumber: 1,
        pageSize: this.pageSize,
        totalCount: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false
      })),
      finalize(() => this.isLoading.set(false)),
    ).subscribe({
      next: (response) => {
        this.products = response.items;
        this.currentPage = response.pageNumber;
        this.pageSize = response.pageSize;
        this.totalCount = response.totalCount;
        this.totalPages = response.totalPages;
        this.hasPrevious = response.hasPrevious;
        this.hasNext = response.hasNext;
      }
    });
  }

  /**
   * Handle page change event from pagination component
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  /**
   * Navigate to create product page
   */
  createProduct(): void {
    this.router.navigate(['/admin/products/create']);
  }

  /**
   * Navigate to edit product page
   */
  editProduct(productId: number): void {
    this.router.navigate(['/admin/products/edit', productId]);
  }

  /**
   * Delete a product
   */
  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this._productsService.deleteProduct(productId).subscribe({
        next: () => {
          console.log(`Product ${productId} deleted`);
          this.products = this.products.filter(x => x.id !== productId);
        },
        error(err) {
          console.log('Delete product error', err);
        },
      });
    }
  }

  /**
   * Get primary image URL for a product
   */
  getProductImage(product: ProductDto): string {
    return product.productImages && product.productImages.length > 0
      ? product.productImages[0].url
      : 'https://placehold.co/150';
  }

  /**
   * Get category names as comma-separated string
   */
  getCategoryNames(product: ProductDto): string {
    return product.categories && product.categories.length > 0
      ? product.categories.map(c => c.name).join(', ')
      : 'No categories';
  }
}
