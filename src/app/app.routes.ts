import { Routes } from '@angular/router';
import { IntervalStatsPageComponent } from './interval-stats-page/interval-stats-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CalendarComponent } from './calendar/calendar.component';

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
];
