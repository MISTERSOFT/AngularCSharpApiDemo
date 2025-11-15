import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductsService } from '@app/services';
import { ProductDto } from '@app/types';
import { catchError, of } from 'rxjs';

export const productResolver: ResolveFn<ProductDto | null> = (route, state) => {
  // Get id from the url
  const id = route.paramMap.get('id');
  // Check if ID is null
  if (!id) {
    return null;
  }

  // Check if ID is a integer by using a regex
  const match = id.match(/^[0-9]+$/)
  if (match === null) {
    return null
  }

  // Parse to integer the result of the match to obtain the ID
  const idInt = +match[0]

  // Inject the Products Service
  const productsService = inject(ProductsService)

  return productsService.getProduct(idInt).pipe(
    catchError((error) => {
      console.error('Load product error:', error);
      return of(null);
    }),
  )
};
