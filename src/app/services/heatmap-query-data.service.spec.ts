import { TestBed } from '@angular/core/testing';

import { HeatmapQueryDataService } from './heatmap-query-data.service';

describe('HeatmapQueryDataService', () => {
  let service: HeatmapQueryDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeatmapQueryDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
