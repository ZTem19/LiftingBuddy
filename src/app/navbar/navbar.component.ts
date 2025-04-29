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

  //Change links here to edit links and paths for routerlink
  //First string the display of the navbar and the second is the path for routerlink
  links: [string, string][] = [
    ['Home', ''],
    ['Interval Stat', '/interval-stats'],
    ['Pages', 'pages'],
    ['Here', 'here'],
    ['Like', 'like'],
    ['Calendar Test', 'calendar'],
    ['Settings', 'settings'],
  ];
}
