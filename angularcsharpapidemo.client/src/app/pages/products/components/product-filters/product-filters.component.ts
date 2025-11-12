import { Component, computed, inject, input, output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { createRangeInputFormGroup } from '@app/shared/ui/range-input';
import { createSelectFormControl } from '@app/shared/ui/select';
import { CategoryDto } from '@app/types';

export interface ProductFilters {
  search: string | null;
  categories: string | null;
  price: {
    min: number | null;
    max: number | null;
  };
}

@Component({
  selector: 'app-products-components-product-filters',
  standalone: false,
  templateUrl: './product-filters.component.html',
})
export class ProductFiltersComponent {
  private _fb = inject(FormBuilder);

  // Input for categories - can be provided by parent component
  categories = input<CategoryDto[]>([])
  categoriesAsOptions = computed(() => this.categories().map(x => ({
    selected: false,
    value: x.id.toString(),
    text: x.name
  })))

  // Output event when filters are applied
  onFiltersApplied = output<ProductFilters>();

  // Reactive Form Group with all filter controls
  formGroup = this._fb.group({
    search: [''],
    categories: createSelectFormControl(),
    price: createRangeInputFormGroup()
  });

  #emitFilters() {
    const filters = this.formGroup.getRawValue() as ProductFilters;
    console.log(filters)
    this.onFiltersApplied.emit(filters);
  }

  /**
   * Handle form submission
   * Validates form and emits filter values to parent component
   */
  onSubmit(): void {
    if (this.formGroup.valid) {
      this.#emitFilters()
    }
  }

  /**
   * Reset all filters to default values
   */
  resetFilters(): void {
    this.formGroup.reset({
      search: '',
      categories: null,
      price: { min: null, max: null }
    });
    this.#emitFilters()
  }

  /**
   * Check if any filter has been applied
   */
  get hasActiveFilters(): boolean {
    const values = this.formGroup.value;
    return !!(
      values.search ||
      values.categories ||
      values.price?.min ||
      values.price?.max
    );
  }
}
