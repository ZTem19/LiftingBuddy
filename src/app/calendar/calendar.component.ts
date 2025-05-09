import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ExerciseSet, MuscleGroup } from '../../data types/data-types';
import { map } from 'rxjs';

@Component({
  selector: 'app-calendar',
  imports: [],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') private calendarScroll!: ElementRef;

  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  firefoxStyle: boolean = false;

  calendarDates?: Date[];
  @Input() exerciseData?: Map<string, ExerciseSet[]>;

  @Input() selectedDay?: Date;
  @Output() selectedDayChange = new EventEmitter<Date>();

  ngOnInit(): void {
    //Get browser as it affects css
    const agent = window.navigator.userAgent;
    if (agent.toLowerCase().indexOf('firefox') > -1) {
      this.firefoxStyle = true;
    }
    console.log('Agent: ' + agent);

    let currentDate = new Date();
    this.selectedDay = currentDate;
    let dayOfWeek = currentDate.getDay();

    //Tweak how long the array is so that the dates end up on the correct day of the week
    let max = 90;
    if (this.firefoxStyle) {
      max = max + (dayOfWeek - 6);
    } else {
      max = max + (dayOfWeek - 5);
    }

    this.calendarDates = [];
    let activeDate = new Date();

    for (let i = max; i >= 0; i--) {
      activeDate.setTime(currentDate.getTime());
      activeDate.setUTCDate(currentDate.getUTCDate() - i);

      this.calendarDates.push(new Date(activeDate));
    }

    setTimeout(() => {
      this.scrollBottom();
    }, 0);
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
    this.selectedDayChange.emit(date);
  }

  isExerciseOnDate(date: Date) {
    const dateString = date.toISOString().split('T')[0];
    return this.exerciseData?.has(dateString);
  }

  getMuscleGroupColor(date: Date): string {
    const dateString = date.toISOString().split('T')[0];
    const exerciseSets = this.exerciseData?.get(dateString);

    const muscleGroupMap = new Map<number, number>();

    if (exerciseSets) {
      for (const exercise of exerciseSets) {
        const mGroup = exercise.exercise.muscleGroup;

        const currentValue = muscleGroupMap.get(mGroup) || 0;
        muscleGroupMap.set(mGroup, currentValue + 1);
      }
    } else {
      return '#f0f0f0';
    }

    // tuple of most common muscle group
    // index 0 is the muscle group, index 1 is the amount of times worked
    let mostCommon = [0, 0];

    for (const value of muscleGroupMap.entries()) {
      if (value[1] > mostCommon[1]) {
        mostCommon = value;
      }
    }

    switch (mostCommon[0]) {
      case 1:
        return 'red';

      case 2:
        return 'blue';

      case 3:
        return 'yellow';

      case 4:
        return 'cyan';

      case 5:
        return 'purple';

      case 6:
        return 'orange';

      default:
        return '#f0f0f0';
    }
  }

  scrollBottom() {
    const calendarElement = this.calendarScroll.nativeElement;
    calendarElement.scrollTop = calendarElement.scrollHeight;
  }
}
