import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ButtonDirective } from '@app/shared/ui/button';
import { PaginationComponent } from '@app/shared/ui/pagination';
import { NgIcon } from '@ng-icons/core';
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
    ButtonDirective,
  ]
})
export class AdminProductsModule { }
