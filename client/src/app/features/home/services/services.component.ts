import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BedsService, UserService } from 'src/app/core/services';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
})
export class ServicesComponent implements OnInit {
  addCustomerServiceForm!: FormGroup;
  beds: any;
  gym: boolean = false;
  email: any;

  constructor(
    private formBuilder: FormBuilder,
    private bedsService: BedsService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.email = params['email'];
    });
    this.addCustomerServiceForm = this.formBuilder.group({
      clothe: 0,
      meal: 0,
      gym: false,
    });

    // this.addCustomerServiceForm.get('gym')?.valueChanges.subscribe((x) => {
    //   // console.log(x);
    //   this.gym = x;
    // });
  }

  onSubmit(): void {
    this.userService
      .addServices(this.addCustomerServiceForm.value, this.email)
      .subscribe((data) => {
        console.log('DATA::::::::::SYUBMIT', data);
        this.addCustomerServiceForm.reset();
      });
  }
}
