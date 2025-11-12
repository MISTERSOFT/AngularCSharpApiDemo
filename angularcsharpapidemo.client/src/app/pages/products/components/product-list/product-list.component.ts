import { Component, input } from '@angular/core';
import { ProductDto } from '@app/types';

@Component({
  selector: 'app-products-components-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
})
export class ProductListComponent {
  products = input<ProductDto[]>([]);
  isLoading = input<boolean>(false);
}
