import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinadorStudentComponent } from './coordinador-student.component';

describe('CoordinadorStudentComponent', () => {
  let component: CoordinadorStudentComponent;
  let fixture: ComponentFixture<CoordinadorStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinadorStudentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoordinadorStudentComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
