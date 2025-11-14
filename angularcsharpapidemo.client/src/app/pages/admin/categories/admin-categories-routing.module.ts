import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminCategoriesComponent } from './admin-categories.component';
import { AdminCategoriesEditComponent } from './categories-edit/admin-categories-edit.component';

const routes: Routes = [
  { path: '', component: AdminCategoriesComponent },
  { path: 'edit/:id', component: AdminCategoriesEditComponent },
  { path: 'create', component: AdminCategoriesEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminCategoriesRoutingModule { }
