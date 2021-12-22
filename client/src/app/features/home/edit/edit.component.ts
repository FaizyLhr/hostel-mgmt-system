import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/core/services';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  editCustomerForm!: FormGroup;

  email: any;
  user: any;

  constructor(
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
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
    this.editCustomerForm = this.formBuilder.group({
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      noOfStayDays: 0,
      allocatedBedNum: '',
    });

    this.route.params.subscribe((params) => {
      // console.log(params['email']);
      this.email = params['email'];
      // console.log(this.email);
    });

    this.getUser();

    // this.update();
  }

  getUser() {
    this.userService.getUser(this.email).subscribe((result) => {
      // console.log('result', result);
      this.user = result.data;
      this.editCustomerForm.patchValue(result.data);

      // console.log(this.user);
    });
  }

  update() {
    this.userService
      .update(this.editCustomerForm.value, this.email)
      .subscribe((result) => {
        console.log('result', result);
        this.user = result.data;
        // console.log(this.allUsers);
      });
  }

  onSubmit(): void {
    // console.log(this.editCustomerForm);

    this.userService.update(this.editCustomerForm.value, this.email).subscribe(
      (result) => {
        console.log(result);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500,
        });
        this.editCustomerForm.reset();
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
