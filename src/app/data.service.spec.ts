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
});
