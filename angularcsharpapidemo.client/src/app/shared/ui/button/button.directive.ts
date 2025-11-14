import { computed, Directive, inject, input } from '@angular/core';
import { ThemeService } from '@app/services';
import { twMerge } from 'tailwind-merge';

type ButtonVariants = {
  default: string
  secondary: string
  danger: string,
  outline: string
}

const DEFAULT_STYLE = "cursor-pointer transition rounded-md"

const BUTTONS_SIZE = {
  sm: 'px-4 py-1',
  md: 'px-6 py-1.5',
  lg: 'px-8 py-2'
}

const BUTTONS_VARIANTS: ButtonVariants = {
  default: 'bg-indigo-500 hover:enabled:bg-indigo-600 text-white',
  secondary: 'bg-indigo-500/70 hover:enabled:bg-indigo-600/70 text-white',
  danger: '', //'bg-red-500 hover:enabled:bg-red-600 text-white',
  outline: 'border border-gray-500/20 text-black hover:enabled:bg-gray-50',
}

const BUTTON_THEMES: { default: ButtonVariants, admin: ButtonVariants } = {
  default: BUTTONS_VARIANTS,
  admin: {
    default: 'bg-blue-600 hover:enabled:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm',
    secondary: 'hover:enabled:bg-gray-100 border border-gray-300 text-gray-700 font-medium rounded-lg transition-colors duration-200',
    danger: 'bg-red-100 hover:enabled:bg-red-200 text-red-600 rounded-lg transition-colors duration-200',
    outline: 'hover:enabled:bg-gray-50 border border-gray-300 text-gray-700 font-medium rounded-lg transition-colors duration-200',
  }
}

/**
 * Button directive that provides flexible styling and properties similar to React
 *
 * @example
 * ```html
 * <!-- Default button -->
 * <button appButton variant="default">Click me</button>
 *
 * <!-- Secondary button with custom size -->
 * <button appButton variant="secondary" size="lg">Large Button</button>
 *
 * <!-- Override classes with custom classes -->
 * <button appButton variant="outline" class="my-custom-class">Custom</button>
 * ```
 */
@Directive({
  selector: 'button[appButton]',
  exportAs: 'appButton',
  standalone: true,
  host: {
    '[attr.class]': 'classList()',
    '[attr.disabled]': 'disabled() ? "" : null'
  }
})
export class ButtonDirective {
  private readonly _themeService = inject(ThemeService)

  class = input<string>('')

  /**
   * Disabled state
   * @default false
   */
  disabled = input<boolean>(false)

  /**
   * Button variant
   * @default 'default'
   */
  variant = input<keyof typeof BUTTONS_VARIANTS>('default')

  /**
   * Button size
   * @default 'md'
   */
  size = input<keyof typeof BUTTONS_SIZE>('md')

  theme = input<keyof typeof BUTTON_THEMES | null>(null)
  private _currentTheme = computed(() => this.theme() || this._themeService.currentTheme())

  classList = computed(() => twMerge(
    DEFAULT_STYLE,
    BUTTON_THEMES[this._currentTheme()][this.variant()],
    BUTTONS_SIZE[this.size()],
    this.disabled() && "disabled:opacity-50 disabled:cursor-not-allowed",
    this.class(),
  ))
}
