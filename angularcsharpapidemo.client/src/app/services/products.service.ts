import { Injectable } from '@angular/core';
import { AbstractBaseService } from 'app/core/base-service';
import { Observable } from 'rxjs';
import { CreateProductDto, ProductDto, UpdateProductDto, PagedResponse, ProductFilterParams } from '../types';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends AbstractBaseService {
  readonly controllerUrl = `${this.baseUrl}/products`

  /**
   * Get all products with pagination and filtering
   */
  getProducts(params?: ProductFilterParams): Observable<PagedResponse<ProductDto>> {
    let httpParams = new HttpParams();

    if (params) {
      httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
      httpParams = httpParams.set('pageSize', params.pageSize.toString());

      // Add filter parameters
      if (params.search) {
        httpParams = httpParams.set('search', params.search);
      }

      if (params.categories) {
        httpParams = httpParams.set('categories', params.categories);
      }

      if (params.minPrice !== null && params.minPrice !== undefined) {
        httpParams = httpParams.set('minPrice', params.minPrice.toString());
      }

      if (params.maxPrice !== null && params.maxPrice !== undefined) {
        httpParams = httpParams.set('maxPrice', params.maxPrice.toString());
      }
    }

    return this.http.get<PagedResponse<ProductDto>>(this.controllerUrl, { params: httpParams });
  }

  /**
   * Get product by ID
   */
  getProduct(id: number): Observable<ProductDto> {
    return this.http.get<ProductDto>(`${this.controllerUrl}/${id}`);
  }

  /**
   * Create a new product (Admin only)
   */
  createProduct(product: CreateProductDto): Observable<ProductDto> {
    return this.http.post<ProductDto>(this.controllerUrl, product);
  }

  /**
   * Update an existing product (Admin only)
   */
  updateProduct(id: number, product: UpdateProductDto): Observable<void> {
    return this.http.put<void>(`${this.controllerUrl}/${id}`, product);
  }

  /**
   * Delete a product (Admin only)
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.controllerUrl}/${id}`);
  }
}
