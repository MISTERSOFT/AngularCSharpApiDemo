import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ButtonDirective } from '@app/shared/ui/button';
import { NgIcon } from '@ng-icons/core';
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
    ReactiveFormsModule,
    AdminCategoriesRoutingModule,
    NgIcon,
    ButtonDirective,
  ]
})
export class AdminCategoriesModule { }
