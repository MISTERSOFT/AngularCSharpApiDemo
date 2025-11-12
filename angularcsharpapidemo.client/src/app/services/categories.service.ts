import { Injectable } from '@angular/core';
import { AbstractBaseService } from 'app/core/base-service';
import { Observable } from 'rxjs';
import { CategoryDto, CreateCategoryDto, ProductDto, UpdateCategoryDto } from '../types';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService extends AbstractBaseService {
  readonly controllerUrl = `${this.baseUrl}/categories`

  /**
   * Get all categories
   */
  getCategories(): Observable<CategoryDto[]> {
    return this.http.get<CategoryDto[]>(this.controllerUrl);
  }

  /**
   * Get category by ID
   */
  getCategory(id: number): Observable<CategoryDto> {
    return this.http.get<CategoryDto>(`${this.controllerUrl}/${id}`);
  }

  /**
   * Get all products for a specific category
   */
  getCategoryProducts(id: number): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.controllerUrl}/${id}/products`);
  }

  /**
   * Create a new category (Admin only)
   */
  createCategory(category: CreateCategoryDto): Observable<CategoryDto> {
    return this.http.post<CategoryDto>(this.controllerUrl, category);
  }

  /**
   * Update an existing category (Admin only)
   */
  updateCategory(id: number, category: UpdateCategoryDto): Observable<void> {
    return this.http.put<void>(`${this.controllerUrl}/${id}`, category);
  }

  /**
   * Delete a category (Admin only)
   */
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.controllerUrl}/${id}`);
  }
}
