import { Injectable, Inject } from '@angular/core';
import { DataService } from './data.service';
import { addDays } from '../utils/utils';
import { MuscleGroup, Exercise, Set as DataSet, ExerciseSet, MuscleGroupProgress } from '../data types/data-types';

@Injectable({
  providedIn: 'root'
})
export class IntervalServiceService {

  constructor(private dataService: DataService) { }
  
  // Returns total volume for each muscle group in the interval
  public GetVolumeMuscleGroup(startDate: Date, endDate: Date): Map<MuscleGroup, number> {
    console.log("Inside of GetVolumeMuscleGroup")
    
    // map of muscle groups to their volumes which will be returned
    let muscleGroupVolumes: Map<MuscleGroup, number> = new Map();

    // set the volume of each muscle group for this interval to 0 by default
    muscleGroupVolumes.set(MuscleGroup.Chest, 0)
    muscleGroupVolumes.set(MuscleGroup.Back, 0)
    muscleGroupVolumes.set(MuscleGroup.Biceps, 0)
    muscleGroupVolumes.set(MuscleGroup.Triceps, 0)
    muscleGroupVolumes.set(MuscleGroup.GlutesQuads, 0)
    muscleGroupVolumes.set(MuscleGroup.HamstringsCalves, 0)

    if(this.dataService.dataMap)
    {
      // Iterate over all days in the interval
      this.dataService.dataMap.forEach((exerciseSets: ExerciseSet[], date: Date)  => {           
        if (!exerciseSets) {
          console.log(`No exercise sets found for date ${date}`);
          return;
        }
        
        if (date >= startDate && date <= endDate) {
          // Iterate over the exercise sets for each day
          for (const exerciseSet of exerciseSets) {
            // Based on the muscle group, accumulate the total volume for that muscle group
            switch (exerciseSet.exercise.muscleGroupWorked) {
              case MuscleGroup.Chest:
                muscleGroupVolumes.set(MuscleGroup.Chest, muscleGroupVolumes.get(MuscleGroup.Chest)! + exerciseSet.totalVolume);
                break;
              case MuscleGroup.Back:
                muscleGroupVolumes.set(MuscleGroup.Back, muscleGroupVolumes.get(MuscleGroup.Back)! + exerciseSet.totalVolume);
                break;
              case MuscleGroup.Biceps:
                muscleGroupVolumes.set(MuscleGroup.Biceps, muscleGroupVolumes.get(MuscleGroup.Biceps)! + exerciseSet.totalVolume);
                break;
              case MuscleGroup.Triceps:
                muscleGroupVolumes.set(MuscleGroup.Triceps, muscleGroupVolumes.get(MuscleGroup.Triceps)! + exerciseSet.totalVolume);
                break;
              case MuscleGroup.GlutesQuads:
                muscleGroupVolumes.set(MuscleGroup.GlutesQuads, muscleGroupVolumes.get(MuscleGroup.GlutesQuads)! + exerciseSet.totalVolume);
                break;
              case MuscleGroup.HamstringsCalves:
                muscleGroupVolumes.set(MuscleGroup.HamstringsCalves, muscleGroupVolumes.get(MuscleGroup.HamstringsCalves)! + exerciseSet.totalVolume);
                break;
            }
          }
        }
      });
    }
    else 
    {
      console.error("dataMap is undefined or null");
    }

    // Return an array of total volumes for each muscle group
    return muscleGroupVolumes;
  }

  // Returns total volume for each exercise worked in the interval
  GetVolumeExercise(startDate: Date, endDate: Date): Map<Exercise, number> {
    // Map to associate an exercise with a total volume for this interval
    let exerciseVolumes: Map<Exercise, number> = new Map();

    // Iterate over all days in the interval
    this.dataService.dataMap.forEach((exerciseSets: ExerciseSet[], date: Date)  => {   
      if (date >= startDate && date <= endDate) {
        if (!exerciseSets) {
          console.warn(`No exercise sets found for date ${date}`);
          return;
        }

        // Iterate over the exercise sets for each day
        for (const exerciseSet of exerciseSets) {
          const currentVolume = exerciseVolumes.get(exerciseSet.exercise) || 0;
          exerciseVolumes.set(exerciseSet.exercise, currentVolume + exerciseSet.totalVolume);
        }
      }
    });

    return exerciseVolumes;
  }

  // Returns volume in first interval, last interval, max interval, and min interval for each muscle group over multiple intervals
  GetIntervalProgress(startDate: Date, numberOfDaysPerInterval: number, numberOfIntervals: number): Map<MuscleGroup, MuscleGroupProgress>
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
      let currentIntervalMap = this.GetVolumeMuscleGroup(intervalStartDate, intervalEndDate);
      console.log(intervalStartDate)
      console.log(intervalEndDate)

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
