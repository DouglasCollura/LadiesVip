import { TestBed } from '@angular/core/testing';

import { GoogleServiceService } from './google-service.service';

describe('GoogleServiceService', () => {
  let service: GoogleServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
