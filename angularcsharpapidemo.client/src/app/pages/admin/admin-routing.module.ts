import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  { path: '', component: AdminComponent },
  {
    path: 'products',
    loadChildren: () => import('./products/admin-products.module').then(m => m.AdminProductsModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./categories/admin-categories.module').then(m => m.AdminCategoriesModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
