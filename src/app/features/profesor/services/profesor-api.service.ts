import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@app/environments/environment';
import { ApiResponse } from '@core/auth/models/api-response.model';
import { SchoolClassResponse } from '@core/auth/models/school-class-response.model';
import { StudentResponse } from '@core/auth/models/student-response.model';
import {
  IncidentResponse,
  CreateIncidentRequest,
  UpdateIncidentRequest,
} from '@core/auth/models/incident-response.model';

@Service()
export class ProfesorApiService {
  private readonly http = inject(HttpClient);
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
    return this.http.post<ApiResponse<IncidentResponse>>(`${this.baseUrl}/incidents`, request);
  }

  updateIncident(
    id: number,
    request: UpdateIncidentRequest
  ): Observable<ApiResponse<IncidentResponse>> {
    return this.http.put<ApiResponse<IncidentResponse>>(`${this.baseUrl}/incidents/${id}`, request);
  }

  deleteIncident(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/incidents/${id}`);
  }

  restoreIncident(id: number): Observable<ApiResponse<IncidentResponse>> {
    return this.http.put<ApiResponse<IncidentResponse>>(
      `${this.baseUrl}/incidents/restore/${id}`,
      {}
    );
  }

  getDeletedIncidents(): Observable<ApiResponse<IncidentResponse[]>> {
    return this.http.get<ApiResponse<IncidentResponse[]>>(`${this.baseUrl}/incidents/deleted`);
  }
}
