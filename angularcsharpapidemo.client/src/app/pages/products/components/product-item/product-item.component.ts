import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProductDto } from '@app/types';

@Component({
  selector: 'app-products-components-product-item',
  standalone: false,
  templateUrl: './product-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductItemComponent {
  product = input.required<ProductDto>();
}
