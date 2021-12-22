import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './customers.component';
import { DetailStaffComponent } from './detail-staff/detail-staff.component';
import { DetailComponent } from './detail/detail.component';
import { ListComponent } from './list/list.component';
import { StaffComponent } from './staff/staff.component';

const routes: Routes = [
  { path: '', component: CustomersComponent },
  { path: 'customer', component: ListComponent },
  { path: 'staff', component: StaffComponent },
  { path: 'report/:email', component: DetailComponent },
  { path: 'staffReport/:email', component: DetailStaffComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersRoutingModule {}
