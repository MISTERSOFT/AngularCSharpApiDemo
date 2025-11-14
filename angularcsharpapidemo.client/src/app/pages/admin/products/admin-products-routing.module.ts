import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminProductsComponent } from './admin-products.component';
import { AdminProductsEditComponent } from './products-edit/admin-products-edit.component';

const routes: Routes = [
  { path: '', component: AdminProductsComponent },
  { path: 'edit/:id', component: AdminProductsEditComponent },
  { path: 'create', component: AdminProductsEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminProductsRoutingModule { }
