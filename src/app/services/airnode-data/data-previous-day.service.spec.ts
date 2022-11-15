import { TestBed } from '@angular/core/testing';

import { DataPreviousDayService } from './data-previous-day.service';

describe('DataPreviousDayService', () => {
  let service: DataPreviousDayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataPreviousDayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
