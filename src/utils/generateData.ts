// import { MuscleGroup, Exercise, Set as DataSet, ExerciseSet } from '../data types/data-types';
// import { getEffortFactor } from './utils';

// // Define one exercise per MuscleGroup
// const exerciseByMuscleGroup: Record<MuscleGroup, Exercise> = {
//     [MuscleGroup.Chest]: {
//       name: 'Bench Press',
//       description: 'Barbell flat bench press',
//       muscleGroup: MuscleGroup.Chest,
//     },
//     [MuscleGroup.Back]: {
//       name: 'Pull Ups',
//       description: 'Bodyweight pull ups',
//       muscleGroup: MuscleGroup.Back,
//     },
//     [MuscleGroup.Biceps]: {
//       name: 'Barbell Curl',
//       description: 'Standing barbell curl',
//       muscleGroup: MuscleGroup.Biceps,
//     },
//     [MuscleGroup.Triceps]: {
//       name: 'Tricep Dips',
//       description: 'Bodyweight dips',
//       muscleGroup: MuscleGroup.Triceps,
//     },
//     [MuscleGroup.GlutesQuads]: {
//       name: 'Back Squat',
//       description: 'Barbell back squat',
//       muscleGroup: MuscleGroup.GlutesQuads,
//     },
//     [MuscleGroup.HamstringsCalves]: {
//       name: 'Deadlifts',
//       description: 'Barbell deadlifts',
//       muscleGroup: MuscleGroup.HamstringsCalves,
//     }
//   };

// // Generate 2 random sets and return them
// function generateRandoSets(): DataSet[] {
//   return [
//     { numOfReps: 10, weight: Math.floor(Math.random() * 51) + 50 }, 
//     { numOfReps: 8, weight: Math.floor(Math.random() * 51) + 50 },  
//   ];
// }

// // Create an ExerciseSet with total volume
// function createRandoExerciseSets(exercise: Exercise): ExerciseSet {
//     const sets = generateRandoSets();
//     const totalVolume = sets.reduce((sum, s) => {
//         const effortFactor = getEffortFactor(s.numOfReps);
//         return Math.floor(sum + (s.numOfReps * s.weight * effortFactor));
//     }, 0);
//     return { exercise, sets, totalVolume };
// }

// function getRandomMuscleGroup(): MuscleGroup {
//   const subset: MuscleGroup[] = [
//     MuscleGroup.Chest,
//     MuscleGroup.Back,
//     MuscleGroup.Biceps,
//     MuscleGroup.Triceps,
//     MuscleGroup.GlutesQuads,
//     MuscleGroup.HamstringsCalves
//   ];
//   const randomIndex = Math.floor(Math.random() * subset.length);
//   return subset[randomIndex];
// }

// // Generate random exercise sets for each day
// function getRandomExercisesForDay(): ExerciseSet[] {
//     const selectedMuscles = new Set<MuscleGroup>();
//     while (selectedMuscles.size < 4) {
//       const randomMuscle = getRandomMuscleGroup();
//       selectedMuscles.add(randomMuscle);
//     }

//     const exerciseSets: ExerciseSet[] = [];
//     for (const muscle of selectedMuscles) {
//       const exercise = exerciseByMuscleGroup[muscle];
//       exerciseSets.push(createRandoExerciseSets(exercise));
//     }

//     return exerciseSets;
//   }

//   export function populateDataMapRando(): Map<String, ExerciseSet[]> {
//     let dataMap: Map<String, ExerciseSet[]> = new Map();
//     const start = new Date('2025-02-01');
//     const end = new Date('2025-03-31');
  
//     for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
//       const exerciseSets: ExerciseSet[] = getRandomExercisesForDay();
//       dataMap.set((new Date(d)).toISOString().slice(0,10), exerciseSets);
//     }
  
//     return dataMap;
//   }

//   // Create two exercise sets off of some values
//   function createTestExerciseSet(exerciseName: string, muscleGroup: MuscleGroup, numOfReps: number, weight: number): ExerciseSet {
//     const exercise: Exercise = {
//       name: exerciseName,
//       description: `A great exercise for the ${MuscleGroup[muscleGroup]}`,
//       muscleGroup: muscleGroup
//     };
  
//     const sets: DataSet[] = [
//       { numOfReps: numOfReps, weight: weight },
//       // Slightly different set for variation
//       { numOfReps: numOfReps - 2, weight: weight + 10 } 
//     ];
  
//     const totalVolume = sets.reduce((sum, s) => {
//       const effortFactor = getEffortFactor(s.numOfReps);
//       return Math.floor(sum + (s.numOfReps * s.weight * effortFactor));
//     }, 0);
  
//     return {
//       exercise: exercise,
//       sets: sets,
//       totalVolume: totalVolume
//     };
//   }

//   // Create a data map of dates and exercise sets for 6 specific days
//   export function createTestDataMap() : Map<Date, ExerciseSet[]>
//   {
//     const testDataMap: Map<Date, ExerciseSet[]> = new Map();
//     // Fill in the test data
//     testDataMap.set(new Date('2025-04-01'), [
//       createTestExerciseSet('Bench Press', MuscleGroup.Chest, 10, 75),
//       createTestExerciseSet('Push Ups', MuscleGroup.Chest, 20, 50)
//     ]);
    
//     testDataMap.set(new Date('2025-04-02'), [
//       createTestExerciseSet('Deadlift', MuscleGroup.Back, 8, 150),
//       createTestExerciseSet('Pull Up', MuscleGroup.Back, 12, 50)
//     ]);
    
//     testDataMap.set(new Date('2025-04-03'), [
//       createTestExerciseSet('Bicep Curl', MuscleGroup.Biceps, 12, 30),
//       createTestExerciseSet('Hammer Curl', MuscleGroup.Biceps, 10, 25)
//     ]);
    
//     testDataMap.set(new Date('2025-04-04'), [
//       createTestExerciseSet('Tricep Dips', MuscleGroup.Triceps, 15, 0),
//       createTestExerciseSet('Overhead Tricep Extension', MuscleGroup.Triceps, 10, 35)
//     ]);
    
//     testDataMap.set(new Date('2025-04-05'), [
//       createTestExerciseSet('Squats', MuscleGroup.GlutesQuads, 10, 100),
//       createTestExerciseSet('Leg Press', MuscleGroup.GlutesQuads, 8, 180)
//     ]);
    
//     testDataMap.set(new Date('2025-04-06'), [
//       createTestExerciseSet('Hamstring Curl', MuscleGroup.HamstringsCalves, 12, 40),
//       createTestExerciseSet('Calf Raise', MuscleGroup.HamstringsCalves, 20, 0)
//     ]);

//     return testDataMap;
//   }
  
  

  