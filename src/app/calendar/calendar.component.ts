import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MuscleGroup } from '../../data types/data-types';

@Component({
  selector: 'app-calendar',
  imports: [],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent implements OnInit {
  calendarDates?: Date[];
  @Input() muscleGroupDate?: Map<Date, MuscleGroup>;

  selectedDay?: Date;
  @Output() selectedDayChange = new EventEmitter<Date>();

  ngOnInit(): void {
    let currentDate = new Date();
    this.selectedDay = currentDate;
    let dayOfWeek = currentDate.getDay();

    //Tweak how long the array is so that the dates end up on the correct day of the week
    let max = 90;
    max = max + (dayOfWeek - 6);

    this.calendarDates = [];
    let activeDate = new Date();

    for (let i = max; i >= 0; i--) {
      activeDate.setTime(currentDate.getTime());
      activeDate.setDate(currentDate.getDate() - i);
      this.calendarDates.push(new Date(activeDate));
    }
  }

  isSelectedDate(day: Date): boolean {
    let selected: string | undefined = this.selectedDay
      ?.toISOString()
      .split('T')[0];
    let given: string = day.toISOString().split('T')[0];

    if (selected?.match(given)) {
      return true;
    }
    return false;
  }

  setSelectedDay(date: Date) {
    this.selectedDay = date;
  }
}
