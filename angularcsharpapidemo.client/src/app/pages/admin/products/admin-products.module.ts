import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { NgIcon } from '@ng-icons/core';
import { PaginationComponent } from '@app/shared/ui/pagination';
import { AdminProductsRoutingModule } from './admin-products-routing.module';
import { AdminProductsComponent } from './admin-products.component';
import { AdminProductsEditComponent } from './products-edit/admin-products-edit.component';


@NgModule({
  declarations: [
    AdminProductsComponent,
    AdminProductsEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminProductsRoutingModule,
    NgIcon,
    PaginationComponent,
  ]
})
export class AdminProductsModule { }
