import { Component, inject, OnInit } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { DatePipe } from '@angular/common';
import { DatasetController } from 'chart.js';
import { DataService } from '../data.service';
import { Exercise, ExerciseSet } from '../../data types/data-types';
import { MuscleGroup } from '../../data types/data-types';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-day-page',
  imports: [CalendarComponent, DatePipe, FormsModule],
  templateUrl: './day-page.component.html',
  styleUrl: './day-page.component.css',
})
export class DayPageComponent implements OnInit {
  today: Date = new Date();
  selectedDate: Date = new Date();
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

  async getData(startDate: Date, endDate: Date): Promise<void> {
    this.dataMap = await this.dataService.getDataInDateRange(
      startDate,
      endDate
    );
  }

  changeDate(date: Date): void {
    this.selectedDate = date;
  }

  getNameOfMuscleGroup(num: number): string {
    return MuscleGroup[num];
  }

  setDateToday(): void {
    this.selectedDate = this.today;
  }

  setsOfCurrentDay(): ExerciseSet[] {
    const dateString = this.selectedDate.toISOString().split('T')[0];
    let exercises: ExerciseSet[] | undefined = [];
    if (this.dataMap) {
      exercises = this.dataMap.get(dateString);
    }

    if (exercises) {
      return exercises;
    }

    return [];
  }
}
