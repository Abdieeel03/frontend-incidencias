import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '@env/environment';
import { ApiResponse } from '@core/auth/models/api-response.model';
import { UserResponse, UpdateUserRequest } from '@core/auth/models/user-response.model';
import { ChangePasswordRequest } from '@core/auth/models/change-password.model';
import { UpdateImageUrlRequest } from '@core/auth/models/update-image-url-request.model';
import { CacheService } from '@core/auth/services/cache.service';

@Service()
export class SettingsApiService {
  private readonly http = inject(HttpClient);
  private readonly cacheService = inject(CacheService);
  private readonly baseUrl = environment.apiUrl;

  getMe(): Observable<ApiResponse<UserResponse>> {
    return this.http.get<ApiResponse<UserResponse>>(`${this.baseUrl}/users/me`);
  }

  updateProfile(request: UpdateUserRequest): Observable<ApiResponse<UserResponse>> {
    return this.http
      .put<ApiResponse<UserResponse>>(`${this.baseUrl}/users/me/update`, request)
      .pipe(tap(() => this.cacheService.invalidate('/users/me')));
  }

  updateImageUrl(request: UpdateImageUrlRequest): Observable<ApiResponse<UserResponse>> {
    return this.http
      .patch<ApiResponse<UserResponse>>(`${this.baseUrl}/users/me/image-url`, request)
      .pipe(tap(() => this.cacheService.invalidate('/users/me')));
  }

  changePassword(request: ChangePasswordRequest): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/users/me/change-password`, request);
  }
}
