import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService, CartService, UserDto } from '@app/services';
import { ButtonDirective } from '@app/shared/ui/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMenu, lucideShoppingCart } from '@ng-icons/lucide';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    NgIcon,
    ButtonDirective
  ],
  templateUrl: './navbar.component.html',
  viewProviders: [provideIcons({ lucideShoppingCart, lucideMenu })]
})
export class NavbarComponent {
  private readonly _cartService = inject(CartService)
  private readonly _authService = inject(AuthService)
  private readonly _router = inject(Router)

  user = input<UserDto | null>(null)
  cartItemsCount = computed(() => this._cartService.currentCart().length)

  logout() {
    this._authService.logout()
    this._router.navigate(['/'])
  }
}
