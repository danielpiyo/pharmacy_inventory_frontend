import { TestBed } from '@angular/core/testing';

import { ExpencesService } from './expences.service';

describe('ExpencesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExpencesService = TestBed.get(ExpencesService);
    expect(service).toBeTruthy();
  });
});
