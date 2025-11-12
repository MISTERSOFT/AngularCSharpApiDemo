import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '@app/services';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  private _authService = inject(AuthService)

  readonly user = computed(() => this._authService.user())
  readonly #HIDE_NAVBAR_FOR_URLS = ['/signin', '/signup']

  hideNavbar$ = inject(Router).events.pipe(
    takeUntilDestroyed(),
    filter(event => event instanceof NavigationEnd),
    map(event => !this.#HIDE_NAVBAR_FOR_URLS.includes(event.url))
  )
}
