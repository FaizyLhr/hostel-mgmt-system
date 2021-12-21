import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddComponent } from './add/add.component';
import { ServicesComponent } from './services/services.component';
import { AddStaffComponent } from './add-staff/add-staff.component';

@NgModule({
  declarations: [HomeComponent, AddComponent, ServicesComponent, AddStaffComponent],
  imports: [CommonModule, HomeRoutingModule, SharedModule],
})
export class HomeModule {}
