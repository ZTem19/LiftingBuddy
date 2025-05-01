import { Routes } from '@angular/router';
import { IntervalStatsPageComponent } from './interval-stats-page/interval-stats-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MuscleGroupProgressPageComponent } from './muscle-group-progress-page/muscle-group-progress-page.component';
import { ExerciseProgressPageComponent } from './exercise-progress-page/exercise-progress-page.component';

//add paths here for different pages
export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },

  //This is a test route for the calendar
  //todo remove
  {
    path: 'calendar',
    component: CalendarComponent,
  },

  { path: 'exercise-progress-page', 
    component: ExerciseProgressPageComponent },

  {
    path: 'muscle-group-progress-page',
    component: MuscleGroupProgressPageComponent,
  },
];
