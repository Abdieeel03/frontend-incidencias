import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '@app/environments/environment';
import { ApiResponse } from '@core/auth/models/api-response.model';
import { SchoolClassResponse } from '@core/auth/models/school-class-response.model';
import { StudentResponse } from '@core/auth/models/student-response.model';
import {
  IncidentResponse,
  CreateIncidentRequest,
  UpdateIncidentRequest,
} from '@core/auth/models/incident-response.model';
import { CacheService } from '@core/auth/services/cache.service';

@Service()
export class ProfesorApiService {
  private readonly http = inject(HttpClient);
  private readonly cacheService = inject(CacheService);
  private readonly baseUrl = environment.apiUrl;

  // ─── CLASES (AULAS) ──────────────────────────────────────────────────
  getMyClasses(): Observable<ApiResponse<SchoolClassResponse[]>> {
    return this.http.get<ApiResponse<SchoolClassResponse[]>>(`${this.baseUrl}/classes/my-classes`);
  }

  getClassById(classId: number): Observable<ApiResponse<SchoolClassResponse>> {
    return this.http.get<ApiResponse<SchoolClassResponse>>(`${this.baseUrl}/classes/${classId}`);
  }

  getClassStudents(classId: number): Observable<ApiResponse<StudentResponse[]>> {
    return this.http.get<ApiResponse<StudentResponse[]>>(
      `${this.baseUrl}/classes/${classId}/students`
    );
  }

  // ─── INCIDENCIAS ─────────────────────────────────────────────────────
  getMyIncidents(): Observable<ApiResponse<IncidentResponse[]>> {
    return this.http.get<ApiResponse<IncidentResponse[]>>(`${this.baseUrl}/incidents/my-incidents`);
  }

  getIncidentById(id: number): Observable<ApiResponse<IncidentResponse>> {
    return this.http.get<ApiResponse<IncidentResponse>>(`${this.baseUrl}/incidents/${id}`);
  }

  createIncident(request: CreateIncidentRequest): Observable<ApiResponse<IncidentResponse>> {
    return this.http
      .post<ApiResponse<IncidentResponse>>(`${this.baseUrl}/incidents`, request)
      .pipe(tap(() => this.cacheService.invalidate('/incidents')));
  }

  updateIncident(
    id: number,
    request: UpdateIncidentRequest
  ): Observable<ApiResponse<IncidentResponse>> {
    return this.http
      .put<ApiResponse<IncidentResponse>>(`${this.baseUrl}/incidents/${id}`, request)
      .pipe(tap(() => this.cacheService.invalidate('/incidents')));
  }

  deleteIncident(id: number): Observable<ApiResponse<void>> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/incidents/${id}`)
      .pipe(tap(() => this.cacheService.invalidate('/incidents')));
  }

  restoreIncident(id: number): Observable<ApiResponse<IncidentResponse>> {
    return this.http
      .put<ApiResponse<IncidentResponse>>(`${this.baseUrl}/incidents/restore/${id}`, {})
      .pipe(tap(() => this.cacheService.invalidate('/incidents')));
  }

  getDeletedIncidents(): Observable<ApiResponse<IncidentResponse[]>> {
    return this.http.get<ApiResponse<IncidentResponse[]>>(`${this.baseUrl}/incidents/deleted`);
  }
}
