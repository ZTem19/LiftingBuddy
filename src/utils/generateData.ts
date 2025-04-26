import { MuscleGroup, Exercise, Set as DataSet, ExerciseSet } from '../data types/data-types';
import { getEffortFactor } from './utils';

// Define one exercise per MuscleGroup
const exerciseByMuscleGroup: Record<MuscleGroup, Exercise> = {
    [MuscleGroup.Chest]: {
      name: 'Bench Press',
      description: 'Barbell flat bench press',
      muscleGroupWorked: MuscleGroup.Chest,
    },
    [MuscleGroup.Back]: {
      name: 'Pull Ups',
      description: 'Bodyweight pull ups',
      muscleGroupWorked: MuscleGroup.Back,
    },
    [MuscleGroup.Biceps]: {
      name: 'Barbell Curl',
      description: 'Standing barbell curl',
      muscleGroupWorked: MuscleGroup.Biceps,
    },
    [MuscleGroup.Triceps]: {
      name: 'Tricep Dips',
      description: 'Bodyweight dips',
      muscleGroupWorked: MuscleGroup.Triceps,
    },
    [MuscleGroup.GlutesQuads]: {
      name: 'Back Squat',
      description: 'Barbell back squat',
      muscleGroupWorked: MuscleGroup.GlutesQuads,
    },
    [MuscleGroup.HamstringsCalves]: {
      name: 'Deadlifts',
      description: 'Barbell deadlifts',
      muscleGroupWorked: MuscleGroup.HamstringsCalves,
    }
  };

// Generate 2 random sets and return them
function generateRandoSets(): DataSet[] {
  return [
    { numOfReps: 10, weight: Math.floor(Math.random() * 51) + 50 }, 
    { numOfReps: 8, weight: Math.floor(Math.random() * 51) + 50 },  
  ];
}

// Create an ExerciseSet with total volume
function createRandoExerciseSets(exercise: Exercise): ExerciseSet {
    const sets = generateRandoSets();
    const totalVolume = sets.reduce((sum, s) => {
        const effortFactor = getEffortFactor(s.numOfReps);
        return Math.floor(sum + (s.numOfReps * s.weight * effortFactor));
    }, 0);
    return { exercise, sets, totalVolume };
}

// Return a random muscle group
function getRandomMuscleGroup(): MuscleGroup {
    const muscleGroups = Object.keys(MuscleGroup)
        .filter(key => isNaN(Number(key))) 
        .map(key => MuscleGroup[key as keyof typeof MuscleGroup]); 

    const randomIndex = Math.floor(Math.random() * muscleGroups.length);
    return muscleGroups[randomIndex];
  }

// Generate random exercise sets for each day
function getRandomExercisesForDay(): ExerciseSet[] {
    const selectedMuscles = new Set<MuscleGroup>();
    while (selectedMuscles.size < 4) {
      const randomMuscle = getRandomMuscleGroup();
      selectedMuscles.add(randomMuscle);
    }

    const exerciseSets: ExerciseSet[] = [];
    for (const muscle of selectedMuscles) {
      const exercise = exerciseByMuscleGroup[muscle];
      exerciseSets.push(createRandoExerciseSets(exercise));
    }

    return exerciseSets;
  }


  // Loop through every day in Feb and Mar 2025 and assign random exercise sets
  export function populateDataMapRando() : Map<Date, ExerciseSet[]>{
    let dataMap: Map<Date, ExerciseSet[]> = new Map();
    const start = new Date('2025-02-01');
    const end = new Date('2025-03-31');

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const exerciseSets: ExerciseSet[] = getRandomExercisesForDay();

      for (const muscle of Object.values(MuscleGroup).filter(val => typeof val === 'number') as MuscleGroup[]) {
        const exercise = exerciseByMuscleGroup[muscle];
        exerciseSets.push(createRandoExerciseSets(exercise));
      }

      dataMap.set(new Date(d), exerciseSets);
    }

    return dataMap;
  }

  // Create two exercise sets off of some values
  function createTestExerciseSet(exerciseName: string, muscleGroup: MuscleGroup, numOfReps: number, weight: number): ExerciseSet {
    const exercise: Exercise = {
      name: exerciseName,
      description: `A great exercise for the ${MuscleGroup[muscleGroup]}`,
      muscleGroupWorked: muscleGroup
    };
  
    const sets: DataSet[] = [
      { numOfReps: numOfReps, weight: weight },
      // Slightly different set for variation
      { numOfReps: numOfReps - 2, weight: weight + 10 } 
    ];
  
    const totalVolume = sets.reduce((sum, s) => {
      const effortFactor = getEffortFactor(s.numOfReps);
      return Math.floor(sum + (s.numOfReps * s.weight * effortFactor));
    }, 0);
  
    return {
      exercise: exercise,
      sets: sets,
      totalVolume: totalVolume
    };
  }

  // Create a data map of dates and exercise sets for 6 specific days
  export function createTestDataMap() : Map<Date, ExerciseSet[]>
  {
    const testDataMap: Map<Date, ExerciseSet[]> = new Map();
    // Fill in the test data
    testDataMap.set(new Date('2025-04-01'), [
      createTestExerciseSet('Bench Press', MuscleGroup.Chest, 10, 75),
      createTestExerciseSet('Push Ups', MuscleGroup.Chest, 20, 50)
    ]);
    
    testDataMap.set(new Date('2025-04-02'), [
      createTestExerciseSet('Deadlift', MuscleGroup.Back, 8, 150),
      createTestExerciseSet('Pull Up', MuscleGroup.Back, 12, 50)
    ]);
    
    testDataMap.set(new Date('2025-04-03'), [
      createTestExerciseSet('Bicep Curl', MuscleGroup.Biceps, 12, 30),
      createTestExerciseSet('Hammer Curl', MuscleGroup.Biceps, 10, 25)
    ]);
    
    testDataMap.set(new Date('2025-04-04'), [
      createTestExerciseSet('Tricep Dips', MuscleGroup.Triceps, 15, 0),
      createTestExerciseSet('Overhead Tricep Extension', MuscleGroup.Triceps, 10, 35)
    ]);
    
    testDataMap.set(new Date('2025-04-05'), [
      createTestExerciseSet('Squats', MuscleGroup.GlutesQuads, 10, 100),
      createTestExerciseSet('Leg Press', MuscleGroup.GlutesQuads, 8, 180)
    ]);
    
    testDataMap.set(new Date('2025-04-06'), [
      createTestExerciseSet('Hamstring Curl', MuscleGroup.HamstringsCalves, 12, 40),
      createTestExerciseSet('Calf Raise', MuscleGroup.HamstringsCalves, 20, 0)
    ]);

    return testDataMap;
  }
  
  

  