import { Component, OnInit, HostListener, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth.service';
import { firstValueFrom } from 'rxjs';
import { User } from '../../data types/data-types';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isNavbarExtended: boolean = true;
  screenWidth: number = 0;
  private changeSize = 800; // Size in pixels for navbar to collapse if below
  private auth = inject(AuthService);
  user: User | null = null;

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.onResize('');
    this.onResize('');
    this.auth.user.subscribe((u) => {
      this.user = u;
    });
  }

  //Get width of window when dom is resized
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 800) {
      this.isNavbarExtended = false;
    } else {
      this.isNavbarExtended = true;
    }
  }

  onNavbarBtnClick() {
    this.isNavbarExtended = !this.isNavbarExtended;
  }

  //Change links here to edit links and paths for routerlink
  //First string the display of the navbar and the second is the path for routerlink
  links: [string, string][] = [
    ['Day', 'day'],
    ['Interval Stats', 'interval-stats'],
    ['Interval Progress', 'interval-progress'],
    ['Exercise Progress', 'exercise-progress-page'],
    ['Muscle Group Progress', 'muscle-group-progress-page'],
    ['Settings', 'settings-page'],
  ];
}
