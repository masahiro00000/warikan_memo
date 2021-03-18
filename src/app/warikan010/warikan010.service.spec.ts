import { TestBed } from '@angular/core/testing';

import { Warikan010Service } from './warikan010.service';

describe('Warikan010Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Warikan010Service = TestBed.get(Warikan010Service);
    expect(service).toBeTruthy();
  });
});
