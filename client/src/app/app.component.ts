import { Component } from '@angular/core';
import { UserService } from './core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'HMS';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.populate();
  }
}
