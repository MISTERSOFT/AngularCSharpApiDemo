import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  { path: '', component: ProductsComponent },
  { path: 'edit/:id', component: EditComponent },
  { path: 'create', component: EditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
