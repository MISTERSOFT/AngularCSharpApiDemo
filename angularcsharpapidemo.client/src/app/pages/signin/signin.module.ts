import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ButtonComponent } from '@app/shared/ui/button';
import { InputComponent } from "@app/shared/ui/input";
import { NgIcon } from '@ng-icons/core';
import { SigninRoutingModule } from './signin-routing.module';
import { SigninComponent } from './signin.component';


@NgModule({
  declarations: [
    SigninComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SigninRoutingModule,
    NgIcon,
    ButtonComponent,
    InputComponent
]
})
export class SigninModule { }
