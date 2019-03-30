import { TestBed } from '@angular/core/testing';

import { AgeAndSexService } from './age-and-sex.service';

describe('AgeAndSexService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AgeAndSexService = TestBed.get(AgeAndSexService);
    expect(service).toBeTruthy();
  });
});
