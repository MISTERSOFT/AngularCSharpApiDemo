import { computed, Directive, input } from '@angular/core';
import { twMerge } from 'tailwind-merge';

const DEFAULT_STYLE = "border border-gray-200 rounded w-full outline-indigo-500"

const INPUT_VARIANTS = {
  rounded: 'bg-transparent text-gray-500/80 placeholder-gray-500/80 text-sm h-full rounded-full'
}

const INPUT_SIZES = {
  md: 'p-2',
  lg: 'p-3'
}

@Directive({
  // selector: 'app-input',
  selector: 'input[appInput]',
  exportAs: 'appInput',
  standalone: true,
  // templateUrl: './input.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  // providers: [
  //   {
  //     provide: NG_VALUE_ACCESSOR,
  //     useExisting: forwardRef(() => InputComponent),
  //     multi: true
  //   }
  // ],
  host: {
    '[class]': 'styles()'
  }
})
export class InputComponent
// implements ControlValueAccessor
{
  type = input<'text' | 'password' | 'email'>('text');
  placeholder = input<string>('');
  className = input<string>('');
  variant = input<keyof typeof INPUT_VARIANTS>('rounded');
  size = input<keyof typeof INPUT_SIZES>('md');

  // value: string = '';
  // disabled: boolean = false;

  // onChange: (value: string) => void = () => {};
  // onTouched: () => void = () => {};

  styles = computed(() => twMerge(
    DEFAULT_STYLE,
    INPUT_VARIANTS[this.variant()],
    this.className(),
    this.size(),
  ));

  // writeValue(value: string): void {
  //   this.value = value || '';
  // }

  // registerOnChange(fn: (value: string) => void): void {
  //   this.onChange = fn;
  // }

  // registerOnTouched(fn: () => void): void {
  //   this.onTouched = fn;
  // }

  // setDisabledState(isDisabled: boolean): void {
  //   this.disabled = isDisabled;
  // }

  // onInput(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   this.value = input.value;
  //   this.onChange(this.value);
  // }

  // onBlur(): void {
  //   this.onTouched();
  // }
}
