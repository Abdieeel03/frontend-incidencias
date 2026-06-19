import { computed, Service, signal } from '@angular/core';

import { AuthResponse } from '../models/auth-response.model';
import { AuthSession } from '../models/auth-session.model';
import { UserRole, USER_ROLES } from '../models/user-role.model';

@Service()
export class AuthService {
  private readonly sessionState = signal<AuthSession | null>(null);

  readonly session = this.sessionState.asReadonly();
  readonly user = computed(() => this.session()?.user ?? null);
  readonly role = computed(() => this.user()?.role ?? null);
  readonly isAuthenticated = computed(() => this.session() !== null);

  setSession(session: AuthSession): void {
    this.sessionState.set(session);
  }

  setSessionFromAuthResponse(response: AuthResponse): void {
    this.setSession({
      accessToken: response.accessToken,
      tokenType: response.tokenType,
      expiresIn: response.expiresIn,
      user: {
        id: response.userId,
        name: response.name,
        username: response.username,
        email: response.email,
        role: response.role,
      },
    });
  }

  clearSession(): void {
    this.sessionState.set(null);
  }

  hasAnyRole(roles: readonly UserRole[]): boolean {
    const currentRole = this.role();

    return currentRole !== null && roles.includes(currentRole);
  }

  getDashboardPath(role = this.role()): string {
    switch (role) {
      case USER_ROLES.COORDINADOR:
        return '/coordinador';
      case USER_ROLES.PROFESOR:
        return '/profesor';
      case USER_ROLES.PADRE:
        return '/padre';
      default:
        return '/login';
    }
  }
}
