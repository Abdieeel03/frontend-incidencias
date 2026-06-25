import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinadorUserComponent } from './coordinador-user.component';

describe('CoordinadorUserComponent', () => {
  let component: CoordinadorUserComponent;
  let fixture: ComponentFixture<CoordinadorUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinadorUserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoordinadorUserComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
