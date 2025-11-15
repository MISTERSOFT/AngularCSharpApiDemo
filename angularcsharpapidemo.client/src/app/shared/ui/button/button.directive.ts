import { computed, Directive, inject, input } from '@angular/core';
import { type Theme, ThemeService } from '@app/services';
import { twMerge } from 'tailwind-merge';

/**
 * Type definition for button variant styles
 * Ensures all themes implement the same variants
 */
type ButtonVariants = {
  default: string
  secondary: string
  danger: string,
  outline: string
}

/**
 * Base styles applied to all buttons regardless of variant or size
 * Provides consistent cursor, transitions, and border radius
 */
const DEFAULT_STYLE = "cursor-pointer transition rounded-md"

/**
 * Button size variants with corresponding Tailwind padding classes
 * - sm: Small buttons for compact UIs
 * - md: Medium buttons (default)
 * - lg: Large buttons for primary actions
 */
const BUTTONS_SIZE = {
  sm: 'px-4 py-1',
  md: 'px-6 py-1.5',
  lg: 'px-8 py-3'
}

/**
 * Default theme button variant styles
 * Uses indigo color scheme with hover states
 * Note: danger variant is empty because we don't need it
 */
const BUTTONS_VARIANTS: ButtonVariants = {
  default: 'bg-indigo-500 hover:enabled:bg-indigo-600 text-white',
  secondary: 'bg-gray-800 hover:enabled:bg-gray-900 text-white',
  danger: '',
  outline: 'border border-gray-500/20 text-black hover:enabled:bg-gray-50',
}

/**
 * Theme-specific button styles
 * Allows switching between different design systems (e.g., default vs admin)
 * - default: Public-facing UI with indigo theme
 * - admin: Admin panel UI with blue theme and enhanced styling
 */
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
 * Button directive that applies default style classes with theme support
 *
 * Provides a React-like API for button styling using Tailwind CSS classes.
 * Supports multiple variants, sizes, themes, and custom class overrides.
 * Uses tailwind-merge to intelligently merge classes and resolve conflicts.
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
 *
 * <!-- Disabled button -->
 * <button appButton [disabled]="true">Disabled</button>
 *
 * <!-- Admin theme button -->
 * <button appButton theme="admin" variant="danger">Delete</button>
 * ```
 */
@Directive({
  selector: 'button[appButton]',
  exportAs: 'appButton',
  standalone: true,
  host: {
    // Bind computed classList to element's class attribute
    '[attr.class]': 'classList()',
    // Set disabled attribute (present when true, absent when false)
    // Empty string instead of "true" for semantic HTML boolean attributes
    '[attr.disabled]': 'disabled() ? "" : null'
  }
})
export class ButtonDirective {
  /**
   * Inject ThemeService to get global theme state
   * Allows buttons to automatically adapt to current theme
   */
  private readonly _themeService = inject(ThemeService)

  /**
   * Custom CSS classes to append to the button
   * These classes are merged last, allowing overrides of default styles
   * @default ''
   */
  class = input<string>('')

  /**
   * Disabled state of the button
   * When true, adds disabled attribute and applies disabled styles
   * @default false
   */
  disabled = input<boolean>(false)

  /**
   * Button variant/style type
   * Determines the visual appearance (colors, borders, etc.)
   * @default 'default'
   */
  variant = input<keyof ButtonVariants>('default')

  /**
   * Button size
   * Controls padding and font size
   * @default 'md'
   */
  size = input<keyof typeof BUTTONS_SIZE>('md')

  /**
   * Override theme for this specific button
   * If null, uses global theme from ThemeService
   * @default null
   */
  theme = input<Theme | null>(null)

  /**
   * Computed current theme
   * Resolves to explicit theme input or falls back to global theme service
   */
  private _currentTheme = computed(() => this.theme() || this._themeService.currentTheme())

  /**
   * Computed class list that merges all button styles
   * Order of merging (later classes override earlier ones):
   * 1. Base default styles (cursor, transition, border-radius)
   * 2. Theme-specific variant styles (colors, hover states)
   * 3. Size-specific styles (padding)
   * 4. Disabled state styles (opacity, cursor)
   * 5. Custom classes from input (final overrides)
   *
   * Uses tailwind-merge to intelligently handle conflicting classes
   */
  classList = computed(() => twMerge(
    DEFAULT_STYLE,
    BUTTON_THEMES[this._currentTheme()][this.variant()],
    BUTTONS_SIZE[this.size()],
    this.disabled() && "disabled:opacity-50 disabled:cursor-not-allowed",
    this.class(),
  ))
}
