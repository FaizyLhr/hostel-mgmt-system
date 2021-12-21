import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css'],
})
export class StaffComponent implements OnInit {
  staffUsers: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getStaff();
  }

  getStaff() {
    this.userService.getStaff().subscribe(
      (data) => {
        console.log(data);
        this.staffUsers = data.data.result;
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
}
