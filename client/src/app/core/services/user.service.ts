import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,  BehaviorSubject ,  ReplaySubject } from 'rxjs';
 ;
import { map ,  distinctUntilChanged } from 'rxjs/operators';
import { ApiService, JwtService } from '.';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<any>({} as any);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private jwtService: JwtService,
    private http: HttpClient
  ) { }

  public get authenticated() {
    return this.isAuthenticatedSubject.value;
  }

  populate() {
    // If JWT detected, attempt to get & store user's info
    if (this.jwtService.get()) {
      this.apiService.get('/users/context')
      .subscribe(
        data => this.setAuth(data.data.user),
        err => {
          this.purgeAuth();
          console.error('Error populating user', err);}
      );
    } else {

      console.log('JWT Error');
      // Remove any potential remnants of previous auth states
      this.purgeAuth();
    }
  }

  setAuth(user: any) {
    // Save JWT sent from server in localstorage
    this.jwtService.save(user.token);
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtService.destroy();
    // Set current user to an empty object
    this.currentUserSubject.next({} as any);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  attemptAuth(type:string , credentials: Object): Observable<any> {
    // console.log("credentials");
    // console.log(type,credentials);
    
    const route = (type === 'login') ? '/login' : '/signUp';
    // const route = '/login';
    let data;
    // let data=credentials;
    type === 'login' ? data = credentials : data = {user: credentials}; 
    // console.log(data);
    return this.apiService.post('/users' + route, data)
      .pipe(map(
      data => {
        // console.log("User Service",data);
        
        if(type === 'login')
        {
          // console.log("IN",this.setAuth(data.data));
          this.setAuth(data.data);
        }
        return data;
      }
    ));
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  // Update the user on the server (email, pass, etc)
  update(user: any): Observable<any> {
    return this.apiService
    .put('/user', { user })
    .pipe(map(data => {
      // Update the currentUser observable
      this.currentUserSubject.next(data.user);
      return data.user;
    }));
  }

  getAllUsers(): Observable<any> {
    return this.apiService.get('/users/all');
  }

  changeStatus(email: string):Observable<any>{
    return this.apiService.put('/users/verify/' + email);
  }
}