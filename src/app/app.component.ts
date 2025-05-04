import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { TitleBarComponent } from './title-bar/title-bar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, TitleBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent{
  
}
