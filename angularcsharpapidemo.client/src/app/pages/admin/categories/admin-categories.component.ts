import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService } from '@app/services';
import { CategoryDto } from '@app/types';
import { provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { catchError, finalize, of } from 'rxjs';


/**
 * Admin categories list component
 * Displays all categories in a table with edit and delete actions
 */
@Component({
  selector: 'app-admin-categories',
  standalone: false,
  templateUrl: './admin-categories.component.html',
  viewProviders: [provideIcons({ lucidePlus })]
})
export class AdminCategoriesComponent implements OnInit {
  private readonly _categoriesService = inject(CategoriesService)

  /**
   * List of all categories
   */
  categories: CategoryDto[] = []

  /**
   * Loading state
   */
  isLoading = signal(false)

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  /**
   * Load all categories from the backend
   */
  loadCategories(): void {
    this.isLoading.set(true)

    this._categoriesService.getCategories().pipe(
      catchError(() => of([] as CategoryDto[])),
      finalize(() => this.isLoading.set(false)),
    ).subscribe({
      next: (categories) => {
        this.categories = categories;
      }
    })
  }

  /**
   * Navigate to create category page
   */
  createCategory(): void {
    this.router.navigate(['/admin/categories/create']);
  }

  /**
   * Navigate to edit category page
   */
  editCategory(categoryId: number): void {
    this.router.navigate(['/admin/categories/edit', categoryId]);
  }

  /**
   * Delete a category
   */
  deleteCategory(categoryId: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this._categoriesService.deleteCategory(categoryId).subscribe({
        next: () => {
          console.log(`Category ${categoryId} deleted`)
          this.categories = this.categories.filter(x => x.id !== categoryId)
        },
        error(err) {
          console.log('Delete category error', err)
        },
      })
    }
  }
}
