import { Routes } from '@angular/router';
import { IntervalStatsPageComponent } from './interval-stats-page/interval-stats-page.component';
import { IntervalProgressComponent } from './interval-progress/interval-progress.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CalendarComponent } from './calendar/calendar.component';
import { DayPageComponent } from './day-page/day-page.component';

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
  //This is a test route for the calendar
  //todo remove
  {
    path: 'calendar',
    component: CalendarComponent,
  },
  {
    path: 'day',
    component: DayPageComponent,
  },
];
