import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  imports: [],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent implements OnInit {
  calendarDates?: Date[];

  ngOnInit(): void {
    let currentDate = new Date();
    console.log(currentDate.getDate());
    console.log(currentDate.getDay());

    let max = 90;
    this.calendarDates = Array<Date>();
    for (let i = max; i > 0; i--) {
      this.calendarDates?.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() - i);
    }
    console.log(this.calendarDates);
  }
}
