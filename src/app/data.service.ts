import { Injectable } from '@angular/core';
import {
  MuscleGroup,
  Exercise,
  Set as DataSet,
  ExerciseSet,
} from '../data types/data-types';
import { populateDataMapRando, createTestDataMap } from '../utils/generateData';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  dataMap: Map<Date, ExerciseSet[]> = new Map();

  constructor() {
    this.dataMap = populateDataMapRando();
  }

  getTotalVolumeForDay(date: Date) {
    if (!this.dataMap.has(date)) return null;
    let exerciseSets = this.dataMap.get(date);
    if (!exerciseSets) return null;
    let total = 0;
    for (const exerciseSet of exerciseSets) total += exerciseSet.totalVolume;
    return total;
  }
}
