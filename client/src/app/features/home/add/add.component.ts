import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BedsService, UserService } from 'src/app/core/services';

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
    private formBuilder: FormBuilder
  ) {}

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

    // console.log(this.addCustomerForm.controls);
    // this.addCustomerForm.valueChanges.subscribe((x) => {
    //   console.log(x);
    //   console.log('Validation', x.invalid);
    //   console.log('Error', x.error);
    // });
  }

  //     res => {
  //       this.beds = res.data.result;
  //       console.log(this.beds);
  //     }
  //   );

  onSubmit(): void {
    this.usersService
      .postUsers(this.addCustomerForm.value)
      .subscribe((data) => {
        console.log(data);
        this.addCustomerForm.reset();
      });
  }
}
