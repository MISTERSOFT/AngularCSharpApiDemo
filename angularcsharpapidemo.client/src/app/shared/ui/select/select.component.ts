import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

export type SelectOption = {
  selected: boolean
  value: string
  text: string
}

export function createSelectFormControl() {
  const fb = inject(FormBuilder)
  const formControl = fb.control(null)
  return formControl
}

@Component({
  selector: 'app-select',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent {
  control = input.required<FormControl<any>>()
  options = input<SelectOption[]>([])
}
