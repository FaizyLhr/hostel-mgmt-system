import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './add/add.component';
import { CustomersComponent } from './customers/customers.component';
import { DetailComponent } from './detail/detail.component';
import { HomeComponent } from './home.component';
import { ServicesComponent } from './services/services.component';

const routes: Routes = [
  { path:"" , component: HomeComponent, children:[
    { path:"" , component: CustomersComponent},
    { path:"add" , component: AddComponent },
    { path:"addServices" , component: ServicesComponent},
    { path:"report" , component: DetailComponent},
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
