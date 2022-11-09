import { TestBed } from '@angular/core/testing';

import { AirnodeDataService } from './airnode-data.service';

describe('AirnodeDataService', () => {
  let service: AirnodeDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AirnodeDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
