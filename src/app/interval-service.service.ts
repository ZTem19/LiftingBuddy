import { Injectable, Inject } from '@angular/core';
import { DataService } from './data.service';
import { addDays } from '../utils/utils';
import { MuscleGroup, Exercise, Set as DataSet, ExerciseSet, MuscleGroupProgress } from '../data types/data-types';

@Injectable({
  providedIn: 'root'
})
export class IntervalServiceService {

  constructor(private dataService: DataService) { }

  // Gets map with muscle group and its total volume in interval
  public async GetVolumeMuscleGroup(startDate: Date, endDate: Date): Promise<Map<number, number>> {
    let muscleGroupVolumes: Map<number, number> = new Map([
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0]
    ]);
  
    // Loop from startDate to endDate
    for (let current = new Date(startDate); current <= endDate; current = addDays(current, 1)) {
      const exerciseSets = await this.dataService.getExerciseSetsForDay("3k7dINFrSssLj0qq8TqF", current);
      
      if (!exerciseSets) continue;
  
      for (const exerciseSet of exerciseSets) {
        const group = exerciseSet.exercise.muscleGroup;
        console.log("Exercise object:", exerciseSet.exercise);
        const currentVolume = muscleGroupVolumes.get(group) || 0;
        muscleGroupVolumes.set(group, currentVolume + exerciseSet.totalVolume);
      }
    }
  
    return muscleGroupVolumes;
  }

  // Gets map with all exercises worked in interval and their volumes
  public async GetVolumeExercise(startDate: Date, endDate: Date): Promise<Map<string, { exercise: Exercise, volume: number }>> {
    const exerciseVolumes = new Map<string, { exercise: Exercise, volume: number }>();
  
    for (let current = new Date(startDate); current <= endDate; current = addDays(current, 1)) {
      const exerciseSets = await this.dataService.getExerciseSetsForDay("3k7dINFrSssLj0qq8TqF", current);
      if (!exerciseSets) continue;
  
      for (const exerciseSet of exerciseSets) {
        const id = exerciseSet.exercise.id;
        const entry = exerciseVolumes.get(id);
  
        if (entry) {
          entry.volume += exerciseSet.totalVolume;
        } else {
          exerciseVolumes.set(id, {
            exercise: exerciseSet.exercise,
            volume: exerciseSet.totalVolume
          });
        }
      }
    }
  
    return exerciseVolumes;
  }

  // Returns volume in first interval, last interval, max interval, and min interval for each muscle group over multiple intervals
  async GetIntervalProgress(startDate: Date, numberOfDaysPerInterval: number, numberOfIntervals: number): Promise<Map<MuscleGroup, MuscleGroupProgress>>
  {
    // Init progress objects
    let chestProgress: MuscleGroupProgress = {volumeFirstInterval: 0, volumeLastInterval: 0, volumeMax: 0, volumeMin: 0};
    let backProgress: MuscleGroupProgress = {volumeFirstInterval: 0, volumeLastInterval: 0, volumeMax: 0, volumeMin: 0};
    let tricepProgress: MuscleGroupProgress = {volumeFirstInterval: 0, volumeLastInterval: 0, volumeMax: 0, volumeMin: 0};
    let bicepProgress: MuscleGroupProgress = {volumeFirstInterval: 0, volumeLastInterval: 0, volumeMax: 0, volumeMin: 0};
    let glutesQuadsProgress: MuscleGroupProgress = {volumeFirstInterval: 0, volumeLastInterval: 0, volumeMax: 0, volumeMin: 0};
    let hamstringsCalvesProgress : MuscleGroupProgress = {volumeFirstInterval: 0, volumeLastInterval: 0, volumeMax: 0, volumeMin: 0};
    
    // init start date and end date for current interval
    let intervalStartDate: Date = startDate;
  
    // iterate through each interval
    for(let i = 0; i < numberOfIntervals; i++)
    {
      let intervalEndDate: Date = addDays(intervalStartDate, numberOfDaysPerInterval - 1);
      
      // get volume for each muscle group in this interval
      let currentIntervalMap = await this.GetVolumeMuscleGroup(intervalStartDate, intervalEndDate);
      
      // init every volume if first interval
      if (i == 0)
      {
        chestProgress.volumeFirstInterval = currentIntervalMap.get(MuscleGroup.Chest) ?? 0;
        backProgress.volumeFirstInterval = currentIntervalMap.get(MuscleGroup.Back) ?? 0;
        tricepProgress.volumeFirstInterval = currentIntervalMap.get(MuscleGroup.Triceps) ?? 0;
        bicepProgress.volumeFirstInterval = currentIntervalMap.get(MuscleGroup.Biceps) ?? 0;
        glutesQuadsProgress.volumeFirstInterval = currentIntervalMap.get(MuscleGroup.GlutesQuads) ?? 0;
        hamstringsCalvesProgress.volumeFirstInterval = currentIntervalMap.get(MuscleGroup.HamstringsCalves) ?? 0;

        chestProgress.volumeMin = currentIntervalMap.get(MuscleGroup.Chest) ?? 0;
        backProgress.volumeMin = currentIntervalMap.get(MuscleGroup.Back) ?? 0;
        tricepProgress.volumeMin = currentIntervalMap.get(MuscleGroup.Triceps) ?? 0;
        bicepProgress.volumeMin = currentIntervalMap.get(MuscleGroup.Biceps) ?? 0;
        glutesQuadsProgress.volumeMin = currentIntervalMap.get(MuscleGroup.GlutesQuads) ?? 0;
        hamstringsCalvesProgress.volumeMin= currentIntervalMap.get(MuscleGroup.HamstringsCalves) ?? 0;

        chestProgress.volumeMax = currentIntervalMap.get(MuscleGroup.Chest) ?? 0;
        backProgress.volumeMax = currentIntervalMap.get(MuscleGroup.Back) ?? 0;
        tricepProgress.volumeMax = currentIntervalMap.get(MuscleGroup.Triceps) ?? 0;
        bicepProgress.volumeMax = currentIntervalMap.get(MuscleGroup.Biceps) ?? 0;
        glutesQuadsProgress.volumeMax = currentIntervalMap.get(MuscleGroup.GlutesQuads) ?? 0;
        hamstringsCalvesProgress.volumeMax = currentIntervalMap.get(MuscleGroup.HamstringsCalves) ?? 0;
      }

      // set last interval volumes if last interval
      if (i == numberOfIntervals - 1)
      {
        chestProgress.volumeLastInterval = currentIntervalMap.get(MuscleGroup.Chest) ?? 0;
        backProgress.volumeLastInterval = currentIntervalMap.get(MuscleGroup.Back) ?? 0;
        tricepProgress.volumeLastInterval = currentIntervalMap.get(MuscleGroup.Triceps) ?? 0;
        bicepProgress.volumeLastInterval = currentIntervalMap.get(MuscleGroup.Biceps) ?? 0;
        glutesQuadsProgress.volumeLastInterval = currentIntervalMap.get(MuscleGroup.GlutesQuads) ?? 0;
        hamstringsCalvesProgress.volumeLastInterval = currentIntervalMap.get(MuscleGroup.HamstringsCalves) ?? 0;
      }

      // calculate min volume based on previous min
      chestProgress.volumeMin = Math.min(currentIntervalMap.get(MuscleGroup.Chest) ?? 0, chestProgress.volumeMin);
      backProgress.volumeMin = Math.min(currentIntervalMap.get(MuscleGroup.Back) ?? 0, backProgress.volumeMin);
      tricepProgress.volumeMin = Math.min(currentIntervalMap.get(MuscleGroup.Triceps) ?? 0, tricepProgress.volumeMin);
      bicepProgress.volumeMin = Math.min(currentIntervalMap.get(MuscleGroup.Biceps) ?? 0, bicepProgress.volumeMin);
      glutesQuadsProgress.volumeMin = Math.min(currentIntervalMap.get(MuscleGroup.GlutesQuads) ?? 0, glutesQuadsProgress.volumeMin);
      hamstringsCalvesProgress.volumeMin = Math.min(currentIntervalMap.get(MuscleGroup.HamstringsCalves) ?? 0, hamstringsCalvesProgress.volumeMin);

      // calculate max volume based on previous max
      chestProgress.volumeMax = Math.max(currentIntervalMap.get(MuscleGroup.Chest) ?? 0, chestProgress.volumeMax);
      backProgress.volumeMax = Math.max(currentIntervalMap.get(MuscleGroup.Back) ?? 0, backProgress.volumeMax);
      tricepProgress.volumeMax = Math.max(currentIntervalMap.get(MuscleGroup.Triceps) ?? 0, tricepProgress.volumeMax);
      bicepProgress.volumeMax = Math.max(currentIntervalMap.get(MuscleGroup.Biceps) ?? 0, bicepProgress.volumeMax);
      glutesQuadsProgress.volumeMax = Math.max(currentIntervalMap.get(MuscleGroup.GlutesQuads) ?? 0, glutesQuadsProgress.volumeMax);
      hamstringsCalvesProgress.volumeMax = Math.max(currentIntervalMap.get(MuscleGroup.HamstringsCalves) ?? 0, hamstringsCalvesProgress.volumeMax);

      // change start date and end date to that of the next interval
      if (i < numberOfIntervals - 1) {
        intervalStartDate = addDays(intervalEndDate, 1);
      }
    }

    // store everything in a map and return
    let progressMap: Map<MuscleGroup, MuscleGroupProgress> = new Map();

    progressMap.set(MuscleGroup.Chest, chestProgress);
    progressMap.set(MuscleGroup.Back, backProgress);
    progressMap.set(MuscleGroup.Biceps, bicepProgress);
    progressMap.set(MuscleGroup.Triceps, tricepProgress);
    progressMap.set(MuscleGroup.GlutesQuads, glutesQuadsProgress);
    progressMap.set(MuscleGroup.HamstringsCalves, hamstringsCalvesProgress);

    return progressMap;

  }
}
