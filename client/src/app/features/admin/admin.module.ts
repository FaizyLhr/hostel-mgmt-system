import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';

import { SharedModule } from 'src/app/shared/shared.module';

import { AdminComponent } from './admin.component';
import { LoginComponent } from './auth/login/login.component';


@NgModule({
  declarations: [
    AdminComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
  ]
})
export class AdminModule { }
