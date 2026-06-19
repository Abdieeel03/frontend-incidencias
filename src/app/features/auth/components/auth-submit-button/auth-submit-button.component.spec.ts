import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthSubmitButtonComponent } from './auth-submit-button.component';

describe('AuthSubmitButtonComponent', () => {
  let component: AuthSubmitButtonComponent;
  let fixture: ComponentFixture<AuthSubmitButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthSubmitButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthSubmitButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Enviar');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
