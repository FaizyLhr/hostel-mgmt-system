import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/core/services';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-staff',
  templateUrl: './edit-staff.component.html',
  styleUrls: ['./edit-staff.component.css'],
})
export class EditStaffComponent implements OnInit {
  editStaffForm: any;

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
  email: any;
  user: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.editStaffForm = this.formBuilder.group({
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      workingDuration: 0,
      jobDescription: '',
    });

    this.route.params.subscribe((params) => {
      // console.log(params['email']);
      this.email = params['email'];
      // console.log(this.email);
    });

    this.getUser();
  }

  getUser() {
    this.userService.getUser(this.email).subscribe((result) => {
      // console.log('result', result);
      this.user = result.data;
      this.editStaffForm.patchValue(result.data);

      // console.log(this.user);
    });
  }

  update() {
    this.userService
      .update(this.editStaffForm.value, this.email)
      .subscribe((result) => {
        console.log('result', result);
        this.user = result.data;
        // console.log(this.allUsers);
      });
  }

  onSubmit() {
    this.userService.update(this.editStaffForm.value, this.email).subscribe(
      (result) => {
        console.log(result);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500,
        });
        this.editStaffForm.reset();
        this.router.navigate(['/home/get/staff']);
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
