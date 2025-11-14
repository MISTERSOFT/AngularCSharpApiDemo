import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ProductsRoutingModule } from './admin-products-routing.module';
import { AdminProductsComponent } from './admin-products.component';
import { AdminProductsEditComponent } from './products-edit/admin-products-edit.component';


@NgModule({
  declarations: [
    AdminProductsComponent,
    AdminProductsEditComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule
  ]
})
export class AdminProductsModule { }
