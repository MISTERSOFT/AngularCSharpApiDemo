import { Injectable, signal } from '@angular/core';

export type Theme = 'default' | 'admin'

@Injectable({providedIn: 'root'})
export class ThemeService {
  currentTheme = signal<Theme>('default')
}
