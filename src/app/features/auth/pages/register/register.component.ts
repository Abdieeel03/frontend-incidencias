import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthSubmitButtonComponent } from '@app/features/auth/components/auth-submit-button/auth-submit-button.component';

@Component({
  selector: 'app-register',
  imports: [AuthSubmitButtonComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {}
