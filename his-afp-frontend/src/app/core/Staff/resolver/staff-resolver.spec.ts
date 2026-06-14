import { TestBed } from '@angular/core/testing';

import { StaffResolver } from './staff-resolver';

describe('StaffResolver', () => {
  let service: StaffResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaffResolver);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
