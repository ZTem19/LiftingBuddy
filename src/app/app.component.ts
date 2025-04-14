import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IntervalStatsPageComponent } from './interval-stats-page/interval-stats-page.component';
import { IntervalProgressComponent } from "./interval-progress/interval-progress.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, IntervalStatsPageComponent, IntervalProgressComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'final-project-ideas';
}
