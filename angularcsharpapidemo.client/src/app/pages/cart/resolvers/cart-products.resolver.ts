import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CartService, ProductsService } from '@app/services';
import { CartProductItem } from '@app/types';
import { catchError, map, of } from 'rxjs';

export const cartProductsResolver: ResolveFn<CartProductItem[]> = (route, state) => {
  const cartService = inject(CartService)
  const productsService = inject(ProductsService)

  const cartItems = cartService.retrieve()
  if (cartItems.length === 0) {
    return of([])
  }

  const productIds = cartItems.map(x => x.productId)

  return productsService.getProductByIds(productIds).pipe(
    catchError((error) => {
      console.error('Load products error:', error);
      return of([]);
    }),
    map(products => products.map(p => ({
      ...p,
      quantity: cartItems.find(x => x.productId === p.id)?.quantity || 0
    } as CartProductItem)))
  )
};
