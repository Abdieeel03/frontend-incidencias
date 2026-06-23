import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinadorDashboardComponent } from './coordinador-dashboard.component';

describe('CoordinadorDashboardComponent', () => {
  let component: CoordinadorDashboardComponent;
  let fixture: ComponentFixture<CoordinadorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinadorDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoordinadorDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
