import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabellaDimessi } from './tabella-dimessi';

describe('TabellaDimessi', () => {
  let component: TabellaDimessi;
  let fixture: ComponentFixture<TabellaDimessi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabellaDimessi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabellaDimessi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
