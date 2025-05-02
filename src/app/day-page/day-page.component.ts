import { Component, OnInit } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-day-page',
  imports: [CalendarComponent, DatePipe],
  templateUrl: './day-page.component.html',
  styleUrl: './day-page.component.css',
})
export class DayPageComponent implements OnInit {
  today: Date = new Date();
  dayOfWeek: number = this.today.getDay();

  ngOnInit(): void {
    console.log(this.today.toISOString());
  }
}
