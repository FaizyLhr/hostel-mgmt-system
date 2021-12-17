import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddComponent } from './add/add.component';
import { CustomersComponent } from './customers/customers.component';
import { ServicesComponent } from './services/services.component';
import { DetailComponent } from './detail/detail.component';


@NgModule({
  declarations: [
    HomeComponent,
    AddComponent,
    CustomersComponent,
    ServicesComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule
  ]
})
export class HomeModule { }
