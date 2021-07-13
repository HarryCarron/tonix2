import { TestBed } from '@angular/core/testing';

import { OscillatorGlobalService } from './oscillator-global.service';

describe('OscillatorGlobalService', () => {
  let service: OscillatorGlobalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OscillatorGlobalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
