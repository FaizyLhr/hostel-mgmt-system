import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BedsService, UserService } from 'src/app/core/services';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.css'],
})
export class AddStaffComponent implements OnInit {
  addStaffForm!: FormGroup;
  beds: any;

  constructor(
    private usersService: UserService,
    private bedsService: BedsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addStaffForm = this.formBuilder.group({
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      workingDuration: 0,
      jobDescription: '',
    });

    // this.addStaffForm.get('role')?.valueChanges.subscribe((x) => {
    //   // console.log(x);
    //   this.role = x;
    // });
  }

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

  onSubmit(): void {
    console.log(this.addStaffForm);

    this.usersService.postStaff(this.addStaffForm.value).subscribe(
      (data) => {
        console.log(data);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500,
        });
        this.addStaffForm.reset();
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
