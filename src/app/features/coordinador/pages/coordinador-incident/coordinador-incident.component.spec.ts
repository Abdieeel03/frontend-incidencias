import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinadorIncidentComponent } from './coordinador-incident.component';

describe('CoordinadorIncidentComponent', () => {
  let component: CoordinadorIncidentComponent;
  let fixture: ComponentFixture<CoordinadorIncidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinadorIncidentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoordinadorIncidentComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
