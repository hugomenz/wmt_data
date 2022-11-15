import { TestBed } from '@angular/core/testing';

import { DateCalculationService } from './date-calculation.service';

describe('DateCalculationService', () => {
  let service: DateCalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateCalculationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
