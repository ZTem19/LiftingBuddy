import { Component, inject, OnInit } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { DatePipe } from '@angular/common';
import { DatasetController } from 'chart.js';
import { DataService } from '../data.service';
import { Exercise, ExerciseSet } from '../../data types/data-types';
import { MuscleGroup } from '../../data types/data-types';

@Component({
  selector: 'app-day-page',
  imports: [CalendarComponent, DatePipe],
  templateUrl: './day-page.component.html',
  styleUrl: './day-page.component.css',
})
export class DayPageComponent implements OnInit {
  today: Date = new Date();
  dayOfWeek: number = this.today.getDay();
  dataService: DataService = inject(DataService);
  exerciseList?: Exercise[];
  dataMap?: Map<string, ExerciseSet[]>;

  ngOnInit(): void {
    this.dataService.ngOnInit();
    this.dataService
      .getAllExercises()
      .subscribe((exercises) => (this.exerciseList = exercises));

    const currentDate = new Date();
    const past = new Date();
    past.setDate(currentDate.getDate() - 100);
    this.getData(past, currentDate);
  }

  async getData(startDate: Date, endDate: Date) {
    this.dataMap = await this.dataService.getDataInDateRange(
      startDate,
      endDate
    );
    // const obj = Object.fromEntries(this.dataMap);
    // console.log('Got Data map: ' + JSON.stringify(obj));
    this.printMap();
  }

  getNameOfMuscleGroup(num: number): string {
    return MuscleGroup[num];
  }

  private printMap() {
    if (this.dataMap) {
      for (let date of this.dataMap?.keys()) {
        console.log('Date : ' + date + '\nValue: ' + this.dataMap.get(date));
      }
    }
  }
}
