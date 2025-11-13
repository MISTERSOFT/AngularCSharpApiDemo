import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService, UserDto } from '@app/services';
import { ButtonComponent } from '@app/shared/ui/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMenu, lucideShoppingCart } from '@ng-icons/lucide';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    NgIcon,
    ButtonComponent,
  ],
  templateUrl: './navbar.component.html',
  viewProviders: [provideIcons({ lucideShoppingCart, lucideMenu })]
})
export class NavbarComponent {
  private readonly _authService = inject(AuthService)
  private readonly _router = inject(Router)
  user = input<UserDto | null>(null)

  logout() {
    this._authService.logout()
    this._router.navigate(['/'])
  }
}
