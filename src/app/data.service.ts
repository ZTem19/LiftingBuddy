import { Injectable } from '@angular/core';
import {
  MuscleGroup,
  Exercise,
  Set as DataSet,
  ExerciseSet,
} from '../data types/data-types';
import { of, Observable, forkJoin, mapTo } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FetchService } from './fetch.service';
import * as exercises from '../exercises.json';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataMap: Map<String, ExerciseSet[]> = new Map();

  constructor(private fetchService: FetchService) {
    this.preloadMonthSets('3k7dINFrSssLj0qq8TqF', 2025, 1);
  }

  async getExerciseSetsForDay(
    userId: string,
    day: Date
  ): Promise<ExerciseSet[]> {
    const key = day.toISOString().slice(0, 10);
    // If cached return immediately
    if (this.dataMap.has(key)) {
      return Promise.resolve(this.dataMap.get(key)!);
    }

    // Otherwise fetch, cache, and return
    try {
      // retrieve exercise sets for day from fetch service
      const exerciseSets = await this.fetchService.getExerciseSetDataForDay(
        userId,
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
    userId: string,
    year: number,
    month: number
  ): Promise<void> {
    // Gets all days for the month and adds them to array
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    const days: Date[] = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }

    // Runs the getExerciseSetsForDay based on userId and day many times in parralel
    await Promise.all(
      days.map((day) => this.getExerciseSetsForDay(userId, day))
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
          console.log('No set for :' + startDate.toString());
        } else {
          group = set.exercise.muscleGroup;
        }
      });
      map.set(this.getDateString(startDate), group);
      startDate.setDate(startDate.getDate() + 1);
    }

    return map;
  }

  getDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
