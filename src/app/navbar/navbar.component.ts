import { Component, OnInit, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

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

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.onResize('');
    this.onResize('');
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
    ['Home', ''],
    ['Day', 'day'],
    ['Interval Stats', '/interval-stats'],
    ['Interval Progress', 'interval-progress'],
    ['Settings', 'settings'],
    ['Interval Stats', 'interval-stats'],
    ['Interval Progress', 'interval-progress'],
    ['Exercise Progress', 'exercise-progress-page'],
    ['Muscle Group Progress', 'muscle-group-progress-page'],
  ];
}
