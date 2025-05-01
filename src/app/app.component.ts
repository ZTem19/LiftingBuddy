import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { TitleBarComponent } from './title-bar/title-bar.component';
import { MuscleGroupProgressPageComponent } from './muscle-group-progress-page/muscle-group-progress-page.component';
import { ExerciseProgressPageComponent } from './exercise-progress-page/exercise-progress-page.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, TitleBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LiftingBuddy';
}
