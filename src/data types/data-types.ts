export enum MuscleGroup
{
    Chest = 1,
    Back = 2,
    Biceps = 3,
    Triceps = 4,
    GlutesQuads = 5,
    HamstringsCalves = 6
}

export interface Exercise
{
    name: string;
    description: string;
    muscleGroupWorked: MuscleGroup;
}

export interface Set
{
    numOfReps: number;
    weight: number;
}

export interface ExerciseSet
{
    exercise: Exercise;
    sets: Set[];
    totalVolume: number;
}

export interface MuscleGroupProgress
{
  volumeFirstInterval: number;
  volumeLastInterval: number;
  volumeMax: number;
  volumeMin: number;
}