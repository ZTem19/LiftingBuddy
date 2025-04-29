import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../data types/data-types';
import { FetchServiceService } from '../fetch-service.service';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  users?: User[];
  fetchService = inject(FetchServiceService);

  ngOnInit() {
    this.fetchService.getUsers().subscribe((users) => (this.users = users));
  }
}
