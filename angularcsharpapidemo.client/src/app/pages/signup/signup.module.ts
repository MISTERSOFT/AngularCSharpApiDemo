import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ButtonDirective } from '@app/shared/ui/button';
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
    ButtonDirective,
    InputComponent
  ]
})
export class SignupModule { }
