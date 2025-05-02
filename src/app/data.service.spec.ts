import { TestBed } from '@angular/core/testing';

import { DataService } from './data.service';
import { ExerciseSet, MuscleGroup } from '../data types/data-types';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a filled map', () => {
    service.dataMap = new Map<Date, ExerciseSet[]>();

    let exerciseSet1: ExerciseSet = {
      exercise: { name: 'bench', description: '', muscleGroupWorked: 1 },
      sets: [{ numOfReps: 1, weight: 200 }],
      totalVolume: 2000,
    };
    let exerciseSet2: ExerciseSet = {
      exercise: { name: 'squad', description: '', muscleGroupWorked: 5 },
      sets: [{ numOfReps: 1, weight: 200 }],
      totalVolume: 2000,
    };

    let exercise1 = [exerciseSet1];
    let exercise2 = [exerciseSet2];

    service.dataMap.set(new Date('2025-01-01T12:00:00'), exercise1);
    service.dataMap.set(new Date('2025-01-02T12:00:00'), exercise2);

    let returnedMap = service.getMuscleGroupForRange(
      new Date('2025-01-01T12:00:00'),
      new Date('2025-01-02:T12:00:00')
    );

    let expectedMap = new Map<Date, MuscleGroup>();
    expectedMap.set(new Date('2025-01-01T12:00:00'), 1);
    expectedMap.set(new Date('2025-01-02T12:00:00'), 5);

    expect(returnedMap).toEqual(expectedMap);
  });
});
