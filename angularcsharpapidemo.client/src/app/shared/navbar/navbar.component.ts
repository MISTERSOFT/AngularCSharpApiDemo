import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '@app/shared/ui/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMenu, lucideShoppingCart } from '@ng-icons/lucide';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    NgIcon,
    ButtonComponent
  ],
  templateUrl: './navbar.component.html',
  styles: ``,
  viewProviders: [provideIcons({ lucideShoppingCart, lucideMenu })]
})
export class NavbarComponent { }
