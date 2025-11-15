import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AuthInterceptor } from '@app/core/http/interceptors';
import { AdminSideMenuComponent } from '@app/shared/admin-side-menu';
import { NavbarComponent } from '@app/shared/navbar';
import { ButtonDirective } from "@app/shared/ui/button";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Error404Component } from './pages/errors/error404/error404.component';
import { LandingComponent } from './pages/landing/landing.component';
import { FooterComponent } from './shared/footer';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    Error404Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NavbarComponent,
    AdminSideMenuComponent,
    ButtonDirective,
    FooterComponent,
],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
