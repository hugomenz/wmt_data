import { TestBed } from '@angular/core/testing';

import { DataCurrentDayService } from './data-current-day.service';

describe('DataCurrentDayService', () => {
  let service: DataCurrentDayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataCurrentDayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
