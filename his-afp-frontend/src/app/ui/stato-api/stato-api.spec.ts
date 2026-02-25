import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatoAPI } from './stato-api';

describe('StatoAPI', () => {
  let component: StatoAPI;
  let fixture: ComponentFixture<StatoAPI>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatoAPI]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatoAPI);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
