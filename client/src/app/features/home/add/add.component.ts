import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BedsService } from 'src/app/core/services';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddComponent implements OnInit {
  addCustomerForm!: FormGroup;
  beds: any;

  constructor(
    private bedsService: BedsService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.addCustomerForm = this.formBuilder.group({
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      jobDescription: ['', Validators.required],
      workingDuration: [0, Validators.required],
      noOfStayDays: [0, Validators.required],
      allocatedBedNum: ['', Validators.required],
    });
  }

  // this.bedsService.getNews().subscribe(
  //     res => {
  //       this.beds = res.data.result;
  //       console.log(this.beds);
  //     }
  //   );

  onSubmit(): void {
    this.bedsService.postNews(this.addCustomerForm.value).subscribe((data) => {
      this.addCustomerForm.reset();
    });
  }
}
