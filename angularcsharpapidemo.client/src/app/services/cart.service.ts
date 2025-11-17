import { Injectable, signal } from '@angular/core';
import { CART_STORAGE_KEY } from '@app/core/constants';

export type CartItem = {
  productId: number
  quantity: number
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _currentCart = signal<CartItem[]>([])
  readonly currentCart = this._currentCart.asReadonly()

  constructor() {
    // Load the cart from the local storage once the service is initialized
    this.retrieve()
  }

  retrieve(): CartItem[] {
    // Get from local storage cart content
    const data = localStorage.getItem(CART_STORAGE_KEY)
    if (!data) {
      // Update the current cart signal value to empty
      this._currentCart.set([])
      return []
    }
    // Parse to JSON the retrieved value
    const parsed = JSON.parse(data) as CartItem[]
    // Update the current cart signal value
    this._currentCart.set(parsed)
    return parsed
  }

  private save(data: CartItem[]) {
    this._currentCart.set(data)
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data))
  }

  add(itemToAdd: CartItem) {
    // Retrieve the cart from the local storage
    const currentCart = this.retrieve()

    // Use a Map object to ensure unique product in the cart.
    const newCart = new Map<number, number>()
    // Add local storage cart to the Map object
    currentCart.forEach(item => newCart.set(item.productId, item.quantity))

    // Update the quantity of the product added
    let quantity = itemToAdd.quantity
    if (newCart.has(itemToAdd.productId)) {
      const previousQty = newCart.get(itemToAdd.productId)!
      quantity += previousQty
    }
    newCart.set(itemToAdd.productId, quantity)

    // Convert the Map object into a readable/useable object
    const cartMapToObject: CartItem[] = Array.from(newCart).map(item => ({ productId: item[0], quantity: item[1] }))
    // Then save the updated cart
    this.save(cartMapToObject)
  }

  remove(productId: number) {
    // Retrieve the cart from the local storage
    const oldCart = this.retrieve()
    // Push the new item
    const newCart = oldCart.filter(item => item.productId !== productId)
    // Save the new cart and prevent duplicate
    this.save(newCart)
  }
}
