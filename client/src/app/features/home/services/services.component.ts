import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BedsService, UserService } from 'src/app/core/services';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
})
export class ServicesComponent implements OnInit {
  addCustomerServiceForm!: FormGroup;
  beds: any;
  gym: string = 'no';
  email: any;

  clotheOptions = [
    {
      title: '1',
      value: 1,
    },
    {
      title: '2',
      value: 2,
    },
    {
      title: '3',
      value: 3,
    },
    {
      title: '4',
      value: 4,
    },
  ];

  mealOptions = [
    {
      title: '1',
      value: 1,
    },
    {
      title: '2',
      value: 2,
    },
    {
      title: '3',
      value: 3,
    },
    {
      title: '4',
      value: 4,
    },
  ];
  user: any;

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
      gym: 'no',
    });

    this.getUser();

    // this.addCustomerServiceForm.get('gym')?.valueChanges.subscribe((x) => {
    //   // console.log(x);
    //   this.gym = x;
    // });
  }

  getUser() {
    this.userService.getUser(this.email).subscribe((result) => {
      console.log('result', result);
      this.user = result.data;
      this.addCustomerServiceForm.patchValue(result.data);

      // console.log(this.user);
    });
  }

  onSubmit(): void {
    this.userService
      .addServices(this.addCustomerServiceForm.value, this.email)
      .subscribe(
        (data) => {
          console.log('DATA::::::::::SYUBMIT', data);
          this.addCustomerServiceForm.reset();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1500,
          });
          this.router.navigate(['/home']);
        },
        (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message,
            footer: '<a href="">Why do I have this issue?</a>',
          });
        }
      );
  }
}
