import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinadorClassComponent } from './coordinador-class.component';

describe('CoordinadorClassComponent', () => {
  let component: CoordinadorClassComponent;
  let fixture: ComponentFixture<CoordinadorClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinadorClassComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoordinadorClassComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
