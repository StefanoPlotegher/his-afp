import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaStaff } from './modifica-staff';

describe('ModificaStaff', () => {
  let component: ModificaStaff;
  let fixture: ComponentFixture<ModificaStaff>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificaStaff]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificaStaff);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
