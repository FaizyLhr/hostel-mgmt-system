import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SigninComponent } from './MyComponents/signin/signin.component';
import { HomeComponent } from './MyComponents/home/home.component';
import { SignUpComponent } from './MyComponents/sign-up/sign-up.component';
import { ProfileComponent } from './MyComponents/profile/profile.component';
import { BoardAdminComponent } from './MyComponents/board-admin/board-admin.component';
import { BoardModeratorComponent } from './MyComponents/board-moderator/board-moderator.component';
import { BoardUserComponent } from './MyComponents/board-user/board-user.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: SigninComponent },
  { path: 'register', component: SignUpComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'user', component: BoardUserComponent },
  { path: 'mod', component: BoardModeratorComponent },
  { path: 'admin', component: BoardAdminComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
