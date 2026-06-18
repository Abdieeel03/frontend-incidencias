import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinadorHomeComponent } from './coordinador-home.component';

describe('CoordinadorHomeComponent', () => {
  let component: CoordinadorHomeComponent;
  let fixture: ComponentFixture<CoordinadorHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinadorHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoordinadorHomeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
