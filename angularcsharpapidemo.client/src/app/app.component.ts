import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService, ThemeService } from '@app/services';
import { filter, map, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  private _router = inject(Router)
  private _authService = inject(AuthService)
  private _themeService = inject(ThemeService)

  readonly user = computed(() => this._authService.user())
  readonly #HIDE_NAVBAR_WHEN: Array<(url: string) => boolean> = [
    (url: string) => url === '/signin',
    (url: string) => url === '/signup',
    (url: string) => url.startsWith('/admin'),
  ]

  /**
   * Observable that determines if the navbar should be hidden
   */
  hideNavbar$ = this._router.events.pipe(
    takeUntilDestroyed(),
    filter(event => event instanceof NavigationEnd),
    map(event => !this.#HIDE_NAVBAR_WHEN.some(f => f(event.url)))
  )

  /**
   * Observable that determines if we're currently in the admin module
   */
  isAdminRoute$ = this._router.events.pipe(
    takeUntilDestroyed(),
    filter(event => event instanceof NavigationEnd),
    map(event => event.url.startsWith('/admin'))
  )

  /**
   * Observable that set the theme automatically depending the module
   */
  autoSetTheme$ = this._router.events.pipe(
    takeUntilDestroyed(),
    filter(event => event instanceof NavigationEnd),
    tap((event) => {
      const currentTheme = event.url.startsWith('/admin') ? 'admin' : 'default'
      this._themeService.currentTheme.set(currentTheme)
    })
  )
}
