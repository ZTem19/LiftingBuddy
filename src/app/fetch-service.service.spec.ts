import { TestBed } from '@angular/core/testing';

import { FetchServiceService } from './fetch-service.service';

describe('FetchServiceService', () => {
  let service: FetchServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
