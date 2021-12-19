import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BedsService, UserService } from 'src/app/core/services';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
})
export class ServicesComponent implements OnInit {
  // loginForm!: FormGroup;
  // hasErrors = false;
  // errorMessage!: string;
  addCustomerServiceForm!: FormGroup;
  beds: any;
  gym: string = '0';

  constructor(
    private formBuilder: FormBuilder,
    private bedsService: BedsService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addCustomerServiceForm = this.formBuilder.group({
      clothe: 0,
      meal: 0,
      gym: '0',
    });

    this.addCustomerServiceForm.get('gym')?.valueChanges.subscribe((x) => {
      // console.log(x);
      this.gym = x;
    });
  }

  onSubmit(): void {
    this.userService
      .addServices(
        this.addCustomerServiceForm.value,
        this.addCustomerServiceForm.get('email')?.value
      )
      .subscribe((data) => {
        console.log(data);
        this.addCustomerServiceForm.reset();
      });
  }
}
