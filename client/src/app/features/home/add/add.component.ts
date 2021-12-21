import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BedsService, UserService } from 'src/app/core/services';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddComponent implements OnInit {
  addCustomerForm!: FormGroup;
  beds: any;
  role: string = 'customer';

  constructor(
    private usersService: UserService,
    private bedsService: BedsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  workingDurationOptions = [
    {
      title: '1-3 months',
      value: 0,
    },
    {
      title: '3-6 months',
      value: 1,
    },
    {
      title: '6-9 months',
      value: 2,
    },
    {
      title: 'above 12 months',
      value: 3,
    },
  ];

  noOfStayDaysOptions = [
    {
      title: '0',
      value: 0,
    },
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
  ];

  ngOnInit(): void {
    this.addCustomerForm = this.formBuilder.group({
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: ['customer', Validators.required],
      jobDescription: '',
      workingDuration: 0,
      noOfStayDays: 0,
      allocatedBedNum: '',
    });

    this.addCustomerForm.get('role')?.valueChanges.subscribe((x) => {
      // console.log(x);
      this.role = x;
    });
  }

  onSubmit(): void {
    console.log(this.addCustomerForm);

    this.usersService.postUsers(this.addCustomerForm.value).subscribe(
      (data) => {
        console.log(data);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500,
        });
        this.addCustomerForm.reset();
        this.router.navigate(['/home']);
      },
      (err) => {
        console.log(err);

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
          footer: '<a href="">Why do I have this issue?</a>',
        });
        console.error(err);
      }
    );
  }
}
