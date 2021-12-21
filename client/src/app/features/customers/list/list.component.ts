import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  customerUsers: any;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers() {
    this.userService.getCustomers().subscribe(
      (data) => {
        console.log(data);
        this.customerUsers = data.data.result;
        // console.log(this.customerUsers);
      },
      (err) => {
        Swal.fire({
          title: 'Error!',
          text: 'Users Not Found',
          icon: 'error',
          confirmButtonText: 'Go Back',
        });
      }
    );
  }

  // updateProfile() {
  //   this.profileForm.patchValue({});
  // }
}
