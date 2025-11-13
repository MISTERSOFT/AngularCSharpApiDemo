import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ButtonComponent } from '@app/shared/ui/button';
import { InputComponent } from '@app/shared/ui/input';
import { NgIcon } from '@ng-icons/core';
import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';


@NgModule({
  declarations: [
    SignupComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SignupRoutingModule,
    NgIcon,
    ButtonComponent,
    InputComponent
  ]
})
export class SignupModule { }
