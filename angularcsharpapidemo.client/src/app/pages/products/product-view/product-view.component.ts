import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, CartService } from '@app/services';
import { ProductDto } from '@app/types';

/**
 * Product details view component
 * Displays comprehensive product information with image gallery, pricing, and purchase options
 */
@Component({
  selector: 'app-product-view',
  standalone: false,
  templateUrl: './product-view.component.html',
})
export class ProductViewComponent implements OnInit {
  private _authService = inject(AuthService)
  private readonly _cartService = inject(CartService)
  private readonly _router = inject(Router)
  private readonly _route = inject(ActivatedRoute);
  private readonly _routeData = toSignal(this._route.data)

  /**
   * Product data loaded from API
   */
  product = computed<ProductDto>(() => this._routeData()!['product'])

  /**
   * Index of currently selected image in gallery
   */
  selectedImageIndex = signal(0);

  /**
   * Currently selected image from product gallery
   */
  selectedImage = computed(() => {
    const prod = this.product();
    const index = this.selectedImageIndex();
    if (prod && prod.productImages.length > 0) {
      return prod.productImages[index] || prod.productImages[0];
    }
    return { id: 0, url: 'https://placehold.co/600x400?text=No+Image' };
  });

  /**
   * Quantity selected for purchase
   */
  quantity = signal(1);

  /**
   * Original price (simulated as 20% higher than current price)
   */
  originalPrice = computed(() => {
    const prod = this.product();
    return prod ? (prod.price * 1.2).toFixed(2) : '0.00';
  });

  /**
   * Discount percentage calculation
   */
  discountPercentage = computed(() => {
    return 20; // Fixed 20% discount for demo
  });

  ngOnInit() {
    if (!this.product()) {
      this._router.navigate(['/404'])
    }
  }

  /**
   * Select image from gallery
   */
  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  /**
   * Increase quantity
   */
  increaseQuantity(): void {
    this.quantity.update(q => q + 1);
  }

  /**
   * Decrease quantity (minimum 1)
   */
  decreaseQuantity(): void {
    this.quantity.update(q => Math.max(1, q - 1));
  }

  /**
   * Add product to cart
   */
  addToCart(): void {
    // Redirect the user to the login page before adding any items in the cart
    if (!this._authService.isAuthenticated()) {
      this._router.navigate(['/signin'], {
        queryParams: {
          redirectTo: this._router.url
        }
      })

      return
    }

    this._cartService.add({
      productId: this.product().id,
      quantity: this.quantity()
    })
  }
}
