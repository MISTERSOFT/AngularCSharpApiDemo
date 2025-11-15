import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '@app/services';
import { CartProductItem } from '@app/types';
import { provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideXCircle } from '@ng-icons/lucide';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  viewProviders: [provideIcons({ lucideArrowLeft, lucideXCircle })]
})
export class CartComponent {
  private readonly _cart = inject(CartService)
  private readonly _route = inject(ActivatedRoute)
  private readonly _routeData = toSignal(this._route.data)
  private _removedItems = signal<number[]>([])

  products = computed<CartProductItem[]>(() => {
    const inCart: CartProductItem[] = this._routeData()!['cartProducts']
    const removed = this._removedItems()
    return inCart.filter(p => !removed.includes(p.id))
  })

  calculatedPrice = computed(() => this.products().reduce((accumulator, product) => accumulator + product.price * product.quantity, 0))

  removeItem(product: CartProductItem) {
    this._cart.remove(product.id)
    this._removedItems.update(ids => [...ids, product.id])
  }
}
