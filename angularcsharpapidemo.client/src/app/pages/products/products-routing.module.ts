import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductViewComponent } from './product-view/product-view.component';
import { ProductsComponent } from './products.component';
import { productResolver } from './resolvers/product.resolver';

const routes: Routes = [
  { path: '', component: ProductsComponent },
  {
    path: ':id',
    component: ProductViewComponent,
    resolve: {
      product: productResolver
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
