import { Component, input } from '@angular/core';

type ButtonType = 'button' | 'submit';

@Component({
  selector: 'app-auth-submit-button',
  imports: [],
  template: `
    <button class="app-button app-button--primary auth-submit" [type]="type()" [disabled]="disabled()">
      {{ label() }}
    </button>
  `,
  styles: `
    .auth-submit {
      width: 100%;
      margin-top: var(--space-md);
    }
  `,
})
export class AuthSubmitButtonComponent {
  readonly label = input.required<string>();
  readonly type = input<ButtonType>('button');
  readonly disabled = input(false);
}
