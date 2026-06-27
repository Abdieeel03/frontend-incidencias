import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@app/environments/environment';
import { ApiResponse } from '@core/auth/models/api-response.model';
import { StudentResponse, StudentDetailResponse } from '@core/auth/models/student-response.model';
import { IncidentResponse } from '@core/auth/models/incident-response.model';

@Service()
export class PadreApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  // ─── ESTUDIANTES (HIJOS) ──────────────────────────────────────────────
  getMyChildren(): Observable<ApiResponse<StudentResponse[]>> {
    return this.http.get<ApiResponse<StudentResponse[]>>(`${this.baseUrl}/students/my-children`);
  }

  getStudentDetails(studentId: number): Observable<ApiResponse<StudentDetailResponse>> {
    return this.http.get<ApiResponse<StudentDetailResponse>>(
      `${this.baseUrl}/students/${studentId}/details`
    );
  }

  // ─── INCIDENCIAS ─────────────────────────────────────────────────────
  getIncidentsByStudent(studentId: number): Observable<ApiResponse<IncidentResponse[]>> {
    return this.http.get<ApiResponse<IncidentResponse[]>>(
      `${this.baseUrl}/incidents/student/${studentId}`
    );
  }

  getIncidentById(id: number): Observable<ApiResponse<IncidentResponse>> {
    return this.http.get<ApiResponse<IncidentResponse>>(`${this.baseUrl}/incidents/${id}`);
  }

  markAsRead(id: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/incidents/${id}/read`, {});
  }
}
