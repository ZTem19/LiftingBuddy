import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  SimpleChange,
  ViewChild,
  signal,
  AfterContentInit,
} from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { DatePipe } from '@angular/common';
import { DatasetController } from 'chart.js';
import { DataService } from '../data.service';
import { Exercise, ExerciseSet } from '../../data types/data-types';
import { MuscleGroup } from '../../data types/data-types';
import { FormsModule, NgModel } from '@angular/forms';
import { WeightUnitPipe } from '../weight-unit.pipe';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AddworkoutComponent } from '../addworkout/addworkout.component';

@Component({
  selector: 'app-day-page',
  imports: [
    CalendarComponent,
    DatePipe,
    FormsModule,
    WeightUnitPipe,
    AddworkoutComponent,
  ],
  templateUrl: './day-page.component.html',
  styleUrl: './day-page.component.css',
})
export class DayPageComponent implements OnInit, AfterContentInit {
  @ViewChild(CalendarComponent) calendarComponent!: CalendarComponent;

  dataService: DataService = inject(DataService);
  userService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  userUnits: boolean = true;
  userID: string = '';
  today: Date = new Date();
  selectedDate: Date = new Date();
  exerciseList?: Exercise[];
  dataMap?: Map<string, ExerciseSet[]>;
  isLoadingData: boolean = false;
  addingWorkout: boolean = false;

  ngOnInit(): void {
    this.dataService.ngOnInit();
    this.isLoadingData = true;
    this.userService.user.subscribe((u) => {
      if (u != null) {
        this.userUnits = u.units == 'lbs' ? true : false;
        this.userID = u.id;
      }
    });
    this.loadData();
  }

  loadData(): void {
    this.dataService.getAllExercises().subscribe((exercises) => {
      this.exerciseList = exercises;
    });
    const currentDate = new Date();
    const past = new Date();
    past.setDate(currentDate.getDate() - 100);
    this.getData(past, currentDate);
  }

  toggleMenu() {
    this.addingWorkout = !this.addingWorkout;
    this.loadData();
  }

  ngAfterContentInit(): void {}

  async getData(startDate: Date, endDate: Date): Promise<void> {
    this.dataMap = await this.dataService.getDataInDateRange(
      startDate,
      endDate,
      this.userID
    );
    this.isLoadingData = false;
  }

  changeDate(date: Date): void {
    this.selectedDate = date;
  }

  getNameOfMuscleGroup(num: number): string {
    return MuscleGroup[num];
  }

  setDateToday(): void {
    this.selectedDate = this.today;
    this.calendarComponent.scrollBottom();
  }

  setsOfCurrentDay(): ExerciseSet[] {
    const dateString = this.selectedDate.toISOString().split('T')[0];
    let exercises: ExerciseSet[] | undefined = [];
    if (this.dataMap) {
      exercises = this.dataMap?.get(dateString);
    }

    if (exercises) {
      return exercises;
    }

    return [];
  }
}
