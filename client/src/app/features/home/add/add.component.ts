import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  email: string = '';
  flag: string = 'false';
  user: any;

  constructor(
    private usersService: UserService,
    private bedsService: BedsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  noOfStayDaysOptions = [
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

  ngOnInit(): void {
    this.addCustomerForm = this.formBuilder.group({
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      noOfStayDays: 0,
      allocatedBedNum: '',
    });
  }

  onSubmit(): void {
    console.log(this.addCustomerForm);
    // console.log('Method', this.user);
    this.usersService.postCustomer(this.addCustomerForm.value).subscribe(
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
