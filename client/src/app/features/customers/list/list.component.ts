import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  allUsers: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe(
      (data) => {
        console.log(data);
        this.allUsers = data.data.result;
        // console.log(this.allUsers);
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
