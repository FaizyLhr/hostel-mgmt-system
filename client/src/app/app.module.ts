import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './MyComponents/signin/signin.component';
import { HomeComponent } from './MyComponents/home/home.component';
import { SignUpComponent } from './MyComponents/sign-up/sign-up.component';
import { NavbarComponent } from './MyComponents/navbar/navbar.component';
import { ProfileComponent } from './MyComponents/profile/profile.component';
import { BoardAdminComponent } from './MyComponents/board-admin/board-admin.component';
import { BoardModeratorComponent } from './MyComponents/board-moderator/board-moderator.component';
import { BoardUserComponent } from './MyComponents/board-user/board-user.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { authInterceptorProviders } from './Helpers/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    HomeComponent,
    SignUpComponent,
    NavbarComponent,
    ProfileComponent,
    BoardAdminComponent,
    BoardModeratorComponent,
    BoardUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
