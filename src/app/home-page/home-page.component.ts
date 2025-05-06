import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../data types/data-types';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  user: User | null = null;
  userService = inject(AuthService);

  ngOnInit() {
    console.log('Is user signed in: ' + this.userService.userSignedIn());
    this.userService.user.subscribe((u) => {
      this.user = u;
      console.log(u);
    });
  }
}
