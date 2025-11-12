import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { twMerge } from 'tailwind-merge';

const DEFAULT_STYLE = "cursor-pointer transition rounded-md"

const BUTTONS_VARIANTS = {
  default: 'bg-indigo-500 hover:bg-indigo-600 text-white',
  secondary: 'bg-indigo-500/70 hover:bg-indigo-600/70 text-white',
  destructive: 'bg-red-500 hover:bg-red-600 text-white',
  outline: 'border border-gray-500/20 text-black hover:bg-gray-50',
}

const BUTTONS_SIZE = {
  sm: 'px-4 py-1',
  md: 'px-6 py-1.5',
  lg: 'px-8 py-2'
}

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  className = input<string>('')
  variant = input<keyof typeof BUTTONS_VARIANTS>('default')
  size = input<keyof typeof BUTTONS_SIZE>('md')
  type = input<'button' | 'reset' | 'submit'>('button')
  disabled = input(false)
  styles = computed(() => twMerge(
    DEFAULT_STYLE,
    this.className(),
    BUTTONS_VARIANTS[this.variant()],
    BUTTONS_SIZE[this.size()],
    this.disabled() && "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white",
  ))
  onClick = output<PointerEvent>()
}
