import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PadreHomeComponent } from './padre-home.component';

describe('PadreHomeComponent', () => {
  let component: PadreHomeComponent;
  let fixture: ComponentFixture<PadreHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PadreHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PadreHomeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
