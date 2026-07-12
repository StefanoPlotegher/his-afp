import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { StaffManager } from './staff-manager';

describe('StaffManager', () => {
  let service: StaffManager;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    service = TestBed.inject(StaffManager);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should populate orderedStaff after fetchStaff', () => {
    service.fetchStaff();

    const request = httpMock.expectOne('/api/users');
    expect(request.request.method).toBe('GET');

    request.flush({
      data: [
        { id: 1, username: 'mario', role: 'INF', isActive: false },
        { id: 2, username: 'alice', role: 'DOC', isActive: true },
      ],
    });

    expect(service.orderedStaff().map((staff) => staff.id)).toEqual([2, 1]);
  });
});
