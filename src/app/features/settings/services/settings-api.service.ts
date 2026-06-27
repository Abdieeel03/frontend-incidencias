import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';
import { ApiResponse } from '@core/auth/models/api-response.model';
import { UserResponse, UpdateUserRequest } from '@core/auth/models/user-response.model';
import { ChangePasswordRequest } from '@core/auth/models/change-password.model';

@Service()
export class SettingsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  updateProfile(request: UpdateUserRequest): Observable<ApiResponse<UserResponse>> {
    return this.http.put<ApiResponse<UserResponse>>(`${this.baseUrl}/users/me/update`, request);
  }

  changePassword(request: ChangePasswordRequest): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/users/me/change-password`, request);
  }
}
