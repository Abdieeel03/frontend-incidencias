import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorHomeComponent } from './profesor-home.component';

describe('ProfesorHomeComponent', () => {
  let component: ProfesorHomeComponent;
  let fixture: ComponentFixture<ProfesorHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfesorHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfesorHomeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
