import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export function createRangeInputFormGroup() {
  const fb = inject(FormBuilder)
  const formGroup = fb.group({
    min: [null, Validators.min(0)],
    max: [null, Validators.min(0)]
  })

  return formGroup
}

@Component({
  selector: 'app-range-input',
  imports: [ReactiveFormsModule],
  templateUrl: './range-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "block",
  }
})
export class RangeInputComponent {
  group = input.required<FormGroup<any>>()
}
