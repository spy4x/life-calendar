import { TestBed } from '@angular/core/testing';

import { AgeAndGenderService } from './age-and-gender.service';

describe('AgeAndGenderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AgeAndGenderService = TestBed.get(AgeAndGenderService);
    expect(service).toBeTruthy();
  });
});
