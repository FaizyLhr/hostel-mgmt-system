import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm !: FormGroup;
  hasErrors = false;
  errorMessage!: string;

  constructor(private formBuilder:FormBuilder,private userService: UserService,private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(){
    this.userService.attemptAuth('login', this.loginForm.value).subscribe(
      data => {
        // console.log(data);
        
        if(data.data.role === 1)
          this.router.navigate(['/home']);
        else
          this.router.navigate(['/login']);
      },
      err => {
        this.hasErrors = true;
        if(err.code === 423)
          this.errorMessage = 'User is not active by admin';
        else
          this.errorMessage = 'Invalid credentials';
      }
    );
  }

}
