import { Routes } from '@angular/router';
import { IntervalStatsPageComponent } from './interval-stats-page/interval-stats-page.component';
import { IntervalProgressComponent } from './interval-progress/interval-progress.component';
import { HomePageComponent } from './home-page/home-page.component';
import { DayPageComponent } from './day-page/day-page.component';
import { MuscleGroupProgressPageComponent } from './muscle-group-progress-page/muscle-group-progress-page.component';
import { ExerciseProgressPageComponent } from './exercise-progress-page/exercise-progress-page.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { LoginPage } from './login-page/login-page.component';
import { RegisterComponent } from './register-page/register-page.component';

//add paths here for different pages
export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'interval-stats',
    component: IntervalStatsPageComponent,
  },
  {
    path: 'interval-progress',
    component: IntervalProgressComponent,
  },
  {
    path: 'day',
    component: DayPageComponent,
  },
  { path: 'exercise-progress-page', component: ExerciseProgressPageComponent },

  {
    path: 'muscle-group-progress-page',
    component: MuscleGroupProgressPageComponent,
  },

  {
    path: 'settings-page',
    component: SettingsPageComponent,
  },

  {
    path: 'login-page',
    component: LoginPage,
  },

  {
    path: 'register-page',
    component: RegisterComponent,
  },
];
