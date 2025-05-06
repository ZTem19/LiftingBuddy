import {
  CanMatch,
  GuardResult,
  MaybeAsync,
  Route,
  Router,
  Routes,
  UrlSegment,
} from '@angular/router';
import { IntervalStatsPageComponent } from './interval-stats-page/interval-stats-page.component';
import { IntervalProgressComponent } from './interval-progress/interval-progress.component';
import { HomePageComponent } from './home-page/home-page.component';
import { DayPageComponent } from './day-page/day-page.component';
import { MuscleGroupProgressPageComponent } from './muscle-group-progress-page/muscle-group-progress-page.component';
import { ExerciseProgressPageComponent } from './exercise-progress-page/exercise-progress-page.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { LoginPage } from './login-page/login-page.component';
import { RegisterComponent } from './register-page/register-page.component';
import { inject, Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '../data types/data-types';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanMatch {
  private auth = inject(AuthService);
  private router = inject(Router);
  private user: User | null = null;
  async canMatch(route: Route, segments: UrlSegment[]) {
    const user = await firstValueFrom(this.auth.user);
    if (!!user) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}

//add paths here for different pages
export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'interval-stats',
    component: IntervalStatsPageComponent,
    canMatch: [UserGuard],
  },
  {
    path: 'interval-progress',
    component: IntervalProgressComponent,
    canMatch: [UserGuard],
  },
  {
    path: 'day',
    component: DayPageComponent,
    canMatch: [UserGuard],
  },
  {
    path: 'exercise-progress-page',
    component: ExerciseProgressPageComponent,
    canMatch: [UserGuard],
  },

  {
    path: 'muscle-group-progress-page',
    component: MuscleGroupProgressPageComponent,
    canMatch: [UserGuard],
  },

  {
    path: 'settings-page',
    component: SettingsPageComponent,
    canMatch: [UserGuard],
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
