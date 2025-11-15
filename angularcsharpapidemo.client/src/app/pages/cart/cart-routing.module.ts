import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart.component';
import { cartProductsResolver } from './resolvers/cart-products.resolver';

const routes: Routes = [
  {
    path: '',
    component: CartComponent,
    resolve: {
      cartProducts: cartProductsResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
