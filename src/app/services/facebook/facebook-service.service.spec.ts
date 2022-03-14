import { TestBed } from '@angular/core/testing';

import { FacebookServiceService } from './facebook-service.service';

describe('FacebookServiceService', () => {
  let service: FacebookServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacebookServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
