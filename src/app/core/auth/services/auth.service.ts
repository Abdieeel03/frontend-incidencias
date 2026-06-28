import { computed, inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';

import { environment } from '@app/environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { AuthResponse } from '../models/auth-response.model';
import { AuthSession } from '../models/auth-session.model';
import { AuthUser } from '../models/auth-user.model';
import { UserResponse } from '../models/user-response.model';
import { UserRole, USER_ROLES } from '../models/user-role.model';
import { LoginRequest, RegisterRequest, ResetPasswordRequest } from '../models/auth-request.model';
import { CacheService } from './cache.service';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly cacheService = inject(CacheService);
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
        this.refreshUserProfile();
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
            this.refreshUserProfile();
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
            this.refreshUserProfile();
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

  private refreshUserProfile(): void {
    this.fetchCurrentUser().subscribe({
      next: (user) => {
        const session = this.session();
        if (session && user) {
          this.setSession({
            ...session,
            user: this.mapUserResponseToAuthUser(user),
          });
        }
      },
      error: () => {
        // Silently ignore — profile image just won't appear
      },
    });
  }

  private fetchCurrentUser(): Observable<UserResponse> {
    return this.http
      .get<ApiResponse<UserResponse>>(`${environment.apiUrl}/users/me`)
      .pipe(map((response) => response.data));
  }

  private mapUserResponseToAuthUser(user: UserResponse): AuthUser {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      imageUrl: user.imageUrl,
    };
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
    this.cacheService.clearAll();
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
