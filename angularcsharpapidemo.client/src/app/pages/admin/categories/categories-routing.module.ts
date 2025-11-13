import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  { path: '', component: CategoriesComponent },
  { path: 'edit/:id', component: EditComponent },
  { path: 'create', component: EditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
