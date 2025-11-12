import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CategoriesService, ProductsService } from '@app/services';
import { PagedResponse, ProductDto } from '@app/types';
import { ProductFilters } from './components/product-filters/product-filters.component';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  private _productsService = inject(ProductsService)
  private _categoriesService = inject(CategoriesService)

  categories$ = this._categoriesService.getCategories()

  // Expose Math for template
  Math = Math;

  // Pagination state
  products = signal<ProductDto[]>([]);
  currentPage = signal<number>(1);
  pageSize = signal<number>(12);
  totalPages = signal<number>(0);
  totalCount = signal<number>(0);
  hasPrevious = signal<boolean>(false);
  hasNext = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  paginationText = computed(() => `Showing ${(this.currentPage() - 1) * this.pageSize() + 1} - ${Math.min(this.currentPage() * this.pageSize(), this.totalCount())} of ${this.totalCount()} products`)

  // Current applied filters
  activeFilters: ProductFilters | null = null;

  ngOnInit(): void {
    this.loadProducts(1);
  }

  /**
   * Load products with pagination and filters
   */
  loadProducts(pageNumber: number): void {
    this.isLoading.set(true);

    // Build filter params
    const filterParams = {
      pageNumber,
      pageSize: this.pageSize(),
      search: this.activeFilters?.search || null,
      categories: this.activeFilters?.categories || null,
      minPrice: this.activeFilters?.price?.min || null,
      maxPrice: this.activeFilters?.price?.max || null
    };

    this._productsService.getProducts(filterParams).subscribe({
      next: (response: PagedResponse<ProductDto>) => {
        this.products.set(response.items);
        this.currentPage.set(response.pageNumber);
        this.totalPages.set(response.totalPages);
        this.totalCount.set(response.totalCount);
        this.hasPrevious.set(response.hasPrevious);
        this.hasNext.set(response.hasNext);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Handle page change from pagination component
   */
  onPageChange(page: number): void {
    this.loadProducts(page);
    // Scroll to top of product list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Handle filter changes from the product-filters component
   */
  onFiltersChanged(filters: ProductFilters): void {
    console.log('Filters applied:', filters);
    this.activeFilters = filters;

    // Reset to page 1 when filters change
    this.loadProducts(1);
  }
}
