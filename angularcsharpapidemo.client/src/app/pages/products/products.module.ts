import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SearchBarComponent } from "@app/shared/search-bar";
import { ButtonDirective } from "@app/shared/ui/button";
import { PaginationComponent } from '@app/shared/ui/pagination';
import { RangeInputComponent } from "@app/shared/ui/range-input";
import { SelectComponent } from "@app/shared/ui/select";
import { ProductFiltersComponent } from './components/product-filters/product-filters.component';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';


@NgModule({
  declarations: [
    ProductsComponent,
    ProductItemComponent,
    ProductListComponent,
    ProductFiltersComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ProductsRoutingModule,
    SearchBarComponent,
    SelectComponent,
    RangeInputComponent,
    ButtonDirective,
    PaginationComponent,
]
})
export class ProductsModule { }
