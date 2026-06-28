import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidenciaFormComponent } from './incidencia-form.component';

describe('IncidenciaFormComponent', () => {
  let component: IncidenciaFormComponent;
  let fixture: ComponentFixture<IncidenciaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidenciaFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidenciaFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
