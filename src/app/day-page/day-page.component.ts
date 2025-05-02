import { Component, inject, OnInit } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { DatePipe } from '@angular/common';
import { DatasetController } from 'chart.js';
import { DataService } from '../data.service';
import { Exercise } from '../../data types/data-types';
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

  ngOnInit(): void {
    this.dataService.ngOnInit();
    this.dataService
      .getAllExercises()
      .subscribe((exercises) => (this.exerciseList = exercises));
  }

  getNameOfMuscleGroup(num: number): string {
    return MuscleGroup[num];
  }
}
