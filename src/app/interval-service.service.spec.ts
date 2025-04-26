import { TestBed } from '@angular/core/testing';

import { IntervalServiceService } from './interval-service.service';

describe('IntervalServiceService', () => {
  let service: IntervalServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntervalServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
