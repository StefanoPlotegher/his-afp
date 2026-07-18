import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDimessi } from './lista-dimessi';

describe('ListaDimessi', () => {
  let component: ListaDimessi;
  let fixture: ComponentFixture<ListaDimessi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaDimessi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaDimessi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
