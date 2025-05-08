import { inject, Injectable, OnInit } from '@angular/core';
import {
  MuscleGroup,
  Exercise,
  eSet as DataSet,
  ExerciseSet,
  eSet,
} from '../data types/data-types';
import { of, Observable, forkJoin, mapTo } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FetchService } from './fetch.service';
import * as exercises from '../exercises.json';
import { Auth, user } from '@angular/fire/auth';
import { AuthService } from './auth.service';
import { BehaviorSubject, Subscription, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { getEffortFactor } from '../utils/utils';

@Injectable({
  providedIn: 'root',
})
export class DataService implements OnInit {
  private dataMap: Map<string, ExerciseSet[]> = new Map();
  private userId?: string | null;
  private fetchService: FetchService = inject(FetchService);
  private authService = inject(AuthService);
  // checks if we have tried to retrieve user id so we do not keep looking for it if it does not exist
  private userIdReady: Promise<string> | null = null;

  constructor(private router: Router) {}

  async ngOnInit(): Promise<void> {
    let resolvedUserId = ""
    try
    {
       resolvedUserId = await this.ensureUserId();
    }
    catch
    {
      return;
    }
   
    // Get workout history for the last 3 months
    const currentDate = new Date();
    const past = new Date();
    past.setDate(currentDate.getDate() - 90);
    this.populateDateMap(past, currentDate, resolvedUserId);
  }

  // async function to ensure user has the id needed for calling in methods
  private async ensureUserId(): Promise<string> 
  {
    if (this.userId) return this.userId;

    if (!this.userIdReady) {
      this.userIdReady = (async () => {
        const user = await firstValueFrom(this.authService.user);
        if (!user) {
          this.router.navigate(['login-page']);
          throw new Error('User not logged in');
        }
        this.userId = user.id;
        return user.id;
      })();
    }

    return this.userIdReady;
}

  resetDataMap() {
    this.dataMap = new Map();
  }

  async getExerciseSetsForDay(
    day: Date,
    userId?: string
  ): Promise<ExerciseSet[]> {
    const resolvedUserId = userId ?? await this.ensureUserId();
    console.log(resolvedUserId);
    const key = day.toISOString().slice(0, 10);
    // If cached return immediately
    if (this.dataMap.has(key)) {
      return Promise.resolve(this.dataMap.get(key)!);
    }

    // Otherwise fetch, cache, and return
    try {
      // retrieve exercise sets for day from fetch service
      const exerciseSets = await this.fetchService.getExerciseSetDataForDay(
        resolvedUserId,
        day
      );
      // Cache the result
      this.dataMap.set(key, exerciseSets || []);
      return exerciseSets || [];
    } catch (error) {
      throw error;
    }
  }

  // Caches a single month to make data retrieval faster, will probably use current month and possibly some before as well
  async preloadMonthSets(
    year: number,
    month: number,
    userId?: string 
  ): Promise<void> {
    const resolvedUserId = userId ?? await this.ensureUserId();
    // Gets all days for the month and adds them to array
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    const days: Date[] = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }

    // Runs the getExerciseSetsForDay based on userId and day many times in parralel
    await Promise.all(
      days.map((day) => this.getExerciseSetsForDay(day, resolvedUserId))
    );
  }

  getMuscleGroupsForDateRange(
    startDate: Date,
    endDate: Date
  ): Map<string, MuscleGroup> {
    if (
      !this.dataMap.has(this.getDateString(startDate)) ||
      !this.dataMap.has(this.getDateString(endDate))
    ) {
      //Check to see if data is cached
      //fetch service get data for date range
    }
    let map = new Map<string, MuscleGroup>();
    while (startDate < endDate) {
      let group: number = 0;
      this.dataMap.get(this.getDateString(startDate))?.forEach((set) => {
        if (set == null) {
          console.error('No set for :' + startDate.toString());
        } else {
          group = set.exercise.muscleGroup;
        }
      });
      map.set(this.getDateString(startDate), group);
      startDate.setDate(startDate.getDate() + 1);
    }

    return map;
  }

  async getDataInDateRange(
    startDate: Date,
    endDate: Date,
    userId?: string
  ): Promise<Map<string, ExerciseSet[]>> {
    const resolvedUserId = userId ?? await this.ensureUserId();
    if (
      !this.dataMap.has(this.getDateString(startDate)) ||
      !this.dataMap.has(this.getDateString(endDate))
    ) {
      await this.populateDateMap(startDate, endDate, resolvedUserId);
    }
    return this.dataMap;
  }

  getAllExercises(): Observable<Exercise[]> {
    return this.fetchService.getAllExercises();
  }

  private async populateDateMap(
    startDate: Date,
    endDate: Date,
    userId?: string
  ): Promise<void> {
    const resolvedUserId = userId ?? await this.ensureUserId();
    console.log('Getting data from fetch service. ');
    this.dataMap = await this.fetchService.getExerciseSetsInDateRange(
      resolvedUserId,
      startDate,
      endDate
    );
    console.log('Got data from fetch service. ');
  }

  private getDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  async addWorkout(
    exercise: Exercise,
    sets: eSet[],
    userId: string,
    date: Date
  ): Promise<void> {
    // Add exercise if not in exercise collection
    let exerciseId: string = '';
    if (exercise.id.trim() == '') {
      exerciseId = await this.fetchService.addExercise(
        exercise.name,
        exercise.muscleGroup,
        exercise.description
      );
    } else {
      exerciseId = exercise.id;
    }

    // Calculate total volume
    let totalvolume = 0;
    for (const set of sets) {
      const effortFactor = getEffortFactor(set.numOfReps);
      totalvolume += Math.floor(set.numOfReps * set.weight * effortFactor);
    }

    const dataRef = await this.fetchService.addExerciseData(
      exerciseId,
      totalvolume,
      userId,
      date
    );

    this.fetchService.addSetData(sets, dataRef);
  }

  async deleteExerciseSet(exerciseSet: ExerciseSet): Promise<void> {
    if (exerciseSet.sets.length == 0) {
      throw new Error('No sets in exercise set');
    }

    const deleteSets = this.fetchService.deleteSets(exerciseSet.sets);

    const deletedata = this.fetchService.deleteData(exerciseSet.sets[0].dataId);

    await deleteSets;
    await deletedata;
  }
}
