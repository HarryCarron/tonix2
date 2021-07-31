import { TestBed } from '@angular/core/testing';

import { UtilitesService } from './utilites.service';

describe('UtilitesService', () => {
  let service: UtilitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilitesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
