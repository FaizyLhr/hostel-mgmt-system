import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  user: any;
  email: any;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // console.log('PARAMS:SS', this.route.params);

    this.route.params.subscribe((params) => {
      // console.log(params['email']);
      this.email = params['email'];
      // console.log(this.email);
    });
    this.getUser();
  }

  getUser() {
    this.userService.getUser(this.email).subscribe((result) => {
      console.log('result', result);
      this.user = result.data;
      // console.log(this.allUsers);
    });
  }
}
