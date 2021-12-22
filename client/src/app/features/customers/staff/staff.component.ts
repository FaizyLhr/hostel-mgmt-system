import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css'],
})
export class StaffComponent implements OnInit {
  staffUsers: any;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.getStaff();
  }

  delUser(user: any) {
    this.userService.deleteUser(user.email).subscribe(
      (result) => {
        console.log(result);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Staff Member Deleted',
          showConfirmButton: false,
          timer: 1500,
        });
        if (result.status === 200) {
          this.getStaff();
        }
      },
      (err) => {
        console.log(err);
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'Go Back',
        });
      }
    );
  }

  getStaff() {
    this.userService.getStaff().subscribe(
      (result) => {
        console.log(result);
        this.staffUsers = result.data.result;

        // this.router.navigate(['/home/get/staff']);
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
