import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../layouts/layout.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from '../customers/detail/detail.component';
import { HomeComponent } from './home.component';
import { ServicesComponent } from './services/services.component';
import { AddStaffComponent } from './add-staff/add-staff.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      {
        path: 'get',
        loadChildren: () =>
          import('../../features/customers/customers.module').then(
            (m) => m.CustomersModule
          ),
      },
      // { path: 'get/all', component: Custo },
      { path: 'add/customer', component: AddComponent },
      { path: 'add/staff', component: AddStaffComponent },
      { path: 'addServices/:email', component: ServicesComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
