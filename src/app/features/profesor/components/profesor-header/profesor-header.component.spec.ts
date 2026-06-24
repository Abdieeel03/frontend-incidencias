import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorHeaderComponent } from './profesor-header.component';

describe('ProfesorHeaderComponent', () => {
  let component: ProfesorHeaderComponent;
  let fixture: ComponentFixture<ProfesorHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfesorHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfesorHeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
