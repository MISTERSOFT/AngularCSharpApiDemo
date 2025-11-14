import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AdminCategoriesRoutingModule } from './admin-categories-routing.module';
import { AdminCategoriesComponent } from './admin-categories.component';
import { AdminCategoriesEditComponent } from './categories-edit/admin-categories-edit.component';


@NgModule({
  declarations: [
    AdminCategoriesComponent,
    AdminCategoriesEditComponent
  ],
  imports: [
    CommonModule,
    AdminCategoriesRoutingModule
  ]
})
export class AdminCategoriesModule { }
