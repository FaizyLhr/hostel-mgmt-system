import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import { ListComponent } from './list/list.component';
import { StaffComponent } from './staff/staff.component';
import { DetailStaffComponent } from './detail-staff/detail-staff.component';

@NgModule({
  declarations: [CustomersComponent, ListComponent, StaffComponent, DetailStaffComponent],
  imports: [CommonModule, CustomersRoutingModule],
})
export class CustomersModule {}
