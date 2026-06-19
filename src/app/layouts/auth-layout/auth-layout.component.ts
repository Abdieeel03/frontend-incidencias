import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  template: `
    <main class="auth-layout">
      <div class="auth-layout__pattern" aria-hidden="true"></div>
      <div class="auth-layout__accent" aria-hidden="true"></div>
      <router-outlet />
    </main>
  `,
  styleUrl: './auth-layout.component.css',
})
export class AuthLayoutComponent {}
