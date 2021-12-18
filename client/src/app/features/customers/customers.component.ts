import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BedsService } from 'src/app/core/services';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent implements OnInit {
  form!: FormGroup;

  news: any;

  constructor(
    private bedsService: BedsService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
    });
    this.bedsService.getBeds().subscribe((res) => {
      this.news = res.data.result;
      console.log(this.news);
    });
  }

  onSubmit() {
    this.bedsService.postBeds(this.form.value).subscribe((data) => {
      this.form.reset();
    });
  }
}
