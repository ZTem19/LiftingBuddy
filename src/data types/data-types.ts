export enum MuscleGroup {
  Unknown = 0,
  Chest = 1,
  Back = 2,
  Biceps = 3,
  Triceps = 4,
  GlutesQuads = 5,
  HamstringsCalves = 6,
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: MuscleGroup;
}

export interface eSet {
  dataId: string;
  numOfReps: number;
  weight: number;
}

export interface ExerciseSet {
  exercise: Exercise;
  sets: eSet[];
  totalVolume: number;
}

export interface MuscleGroupProgress {
  volumeFirstInterval: number;
  volumeLastInterval: number;
  volumeMax: number;
  volumeMin: number;
}

export interface User {
  id: string;
  fname: string;
  lname: string;
  password: string;
}
