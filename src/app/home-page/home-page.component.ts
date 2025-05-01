import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../data types/data-types';
import { UserAuthenticationService } from '../user-authentication.service';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  users?: User[];
  userService = inject(UserAuthenticationService);

  ngOnInit() {
    this.userService.getUsers().subscribe((users) => (this.users = users));
  }
}
