import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { UserResponse } from '../models/user-response.model';
import { StudentResponse } from '../models/student-response.model';
import { SchoolClassResponse } from '../models/school-class-response.model';
import { IncidentResponse } from '../models/incident-response.model';

@Service()
export class CoordinadorApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  getUsers(): Observable<ApiResponse<UserResponse[]>> {
    return this.http.get<ApiResponse<UserResponse[]>>(`${this.baseUrl}/users`);
  }

  getStudents(): Observable<ApiResponse<StudentResponse[]>> {
    return this.http.get<ApiResponse<StudentResponse[]>>(`${this.baseUrl}/students`);
  }

  getClasses(): Observable<ApiResponse<SchoolClassResponse[]>> {
    return this.http.get<ApiResponse<SchoolClassResponse[]>>(`${this.baseUrl}/classes`);
  }

  getIncidents(): Observable<ApiResponse<IncidentResponse[]>> {
    return this.http.get<ApiResponse<IncidentResponse[]>>(`${this.baseUrl}/incidents`);
  }
}
