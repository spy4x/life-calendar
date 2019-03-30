import { TestBed } from '@angular/core/testing';

import { AgeOfDeathService } from './age-of-death.service';

describe('AgeAndSexService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AgeOfDeathService = TestBed.get(AgeOfDeathService);
    expect(service).toBeTruthy();
  });
});
