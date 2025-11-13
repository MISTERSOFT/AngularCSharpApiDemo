import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideLayoutDashboard, lucidePackage, lucideTag } from '@ng-icons/lucide';

type ItemSeparator = { type: 'separator' }
type Item = { type: 'link', path: string, label: string, icon: string }
type MenuItem = Item | ItemSeparator

/**
 * Admin side menu component displayed in the admin module.
 * Provides navigation links to main app and admin sections.
 */
@Component({
  selector: 'app-admin-side-menu',
  standalone: true,
  templateUrl: './admin-side-menu.component.html',
  imports: [
    RouterLink,
    NgIcon,
  ],
  viewProviders: [provideIcons({ lucideArrowLeft, lucideLayoutDashboard, lucidePackage, lucideTag })]
})
export class AdminSideMenuComponent {
  /**
   * Navigation menu items
   */
  readonly menuItems: MenuItem[] = [
    { type: 'link', path: '/', label: 'Back to shop', icon: 'lucideArrowLeft' },
    { type: 'separator' },
    { type: 'link', path: '/admin', label: 'Dashboard', icon: 'lucideLayoutDashboard' },
    { type: 'link', path: '/admin/products', label: 'Products', icon: 'lucidePackage' },
    { type: 'link', path: '/admin/categories', label: 'Categories', icon: 'lucideTag' }
  ];

  constructor(public router: Router) {}

  /**
   * Check if the given path is currently active
   */
  isActive(path: string): boolean {
    return this.router.url === path;
  }
}
