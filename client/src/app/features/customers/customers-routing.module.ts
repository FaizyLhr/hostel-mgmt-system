import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './customers.component';
import { DetailComponent } from './detail/detail.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  { path: '', component: CustomersComponent },
  { path: 'all', component: ListComponent },
  { path: 'report/:email', component: DetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersRoutingModule {}
