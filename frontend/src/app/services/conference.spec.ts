import { TestBed } from '@angular/core/testing';

import { Conference } from './conference';

describe('Conference', () => {
  let service: Conference;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Conference);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
