import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonDirective } from '@app/shared/ui/button';
import { NgIcon } from '@ng-icons/core';
import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';


@NgModule({
  declarations: [
    CartComponent
  ],
  imports: [
    CommonModule,
    CartRoutingModule,
    NgIcon,
    ButtonDirective,
  ]
})
export class CartModule { }
