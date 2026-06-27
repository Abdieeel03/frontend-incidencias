import { computed, inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '@app/environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { AuthResponse } from '../models/auth-response.model';
import { AuthSession } from '../models/auth-session.model';
import { UserRole, USER_ROLES } from '../models/user-role.model';
import { LoginRequest, RegisterRequest, ResetPasswordRequest } from '../models/auth-request.model';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly sessionState = signal<AuthSession | null>(null);

  readonly session = this.sessionState.asReadonly();
  readonly user = computed(() => this.session()?.user ?? null);
  readonly role = computed(() => this.user()?.role ?? null);
  readonly isAuthenticated = computed(() => this.session() !== null);

  constructor() {
    const savedSession = localStorage.getItem('rise_session');
    if (savedSession) {
      try {
        this.sessionState.set(JSON.parse(savedSession));
      } catch {
        localStorage.removeItem('rise_session');
      }
    }
  }

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/login`, request)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.setSessionFromAuthResponse(response.data);
          }
        })
      );
  }

  register(request: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/register`, request)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.setSessionFromAuthResponse(response.data);
          }
        })
      );
  }

  forgotPassword(email: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${environment.apiUrl}/auth/forgot-password`, {
      email,
    });
  }

  verifyResetCode(email: string, code: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${environment.apiUrl}/auth/verify-reset-code`, {
      email,
      code,
    });
  }

  resetPassword(request: ResetPasswordRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${environment.apiUrl}/auth/reset-password`, request);
  }

  setSession(session: AuthSession): void {
    this.sessionState.set(session);
    localStorage.setItem('rise_session', JSON.stringify(session));
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
        imageUrl: response.imageUrl,
      },
    });
  }

  clearSession(): void {
    this.sessionState.set(null);
    localStorage.removeItem('rise_session');
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
