import { TestBed } from '@angular/core/testing';

import { AirnodeQueryDataService } from './airnode-query-data.service';

describe('AirnodeQueryDataService', () => {
  let service: AirnodeQueryDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AirnodeQueryDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
