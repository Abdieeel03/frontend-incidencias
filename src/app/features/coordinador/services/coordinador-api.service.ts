import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '@app/environments/environment';
import { ApiResponse } from '@core/auth/models/api-response.model';
import {
  UserResponse,
  CreateUserRequest,
  CoordinatorUpdateUserRequest,
} from '@core/auth/models/user-response.model';
import {
  StudentResponse,
  CreateStudentRequest,
  UpdateStudentRequest,
  StudentDetailResponse,
} from '@core/auth/models/student-response.model';
import {
  SchoolClassResponse,
  CreateClassRequest,
  UpdateSchoolClassRequest,
  AddStudentsRequest,
} from '@core/auth/models/school-class-response.model';
import { IncidentResponse } from '@core/auth/models/incident-response.model';
import { CacheService } from '@core/auth/services/cache.service';

@Service()
export class CoordinadorApiService {
  private readonly http = inject(HttpClient);
  private readonly cacheService = inject(CacheService);
  private readonly baseUrl = environment.apiUrl;

  // ─── USUARIOS ────────────────────────────────────────────────────────
  getUsers(): Observable<ApiResponse<UserResponse[]>> {
    return this.http.get<ApiResponse<UserResponse[]>>(`${this.baseUrl}/users`);
  }

  getUserById(id: number): Observable<ApiResponse<UserResponse>> {
    return this.http.get<ApiResponse<UserResponse>>(`${this.baseUrl}/users/${id}`);
  }

  getTeachers(): Observable<ApiResponse<UserResponse[]>> {
    return this.http.get<ApiResponse<UserResponse[]>>(`${this.baseUrl}/users/teachers`);
  }

  getParents(): Observable<ApiResponse<UserResponse[]>> {
    return this.http.get<ApiResponse<UserResponse[]>>(`${this.baseUrl}/users/parents`);
  }

  searchParentByDni(dni: string): Observable<ApiResponse<UserResponse>> {
    return this.http.get<ApiResponse<UserResponse>>(`${this.baseUrl}/users/parents/dni/${dni}`);
  }

  createUser(request: CreateUserRequest): Observable<ApiResponse<UserResponse>> {
    return this.http
      .post<ApiResponse<UserResponse>>(`${this.baseUrl}/users`, request)
      .pipe(tap(() => this.cacheService.invalidate('/users')));
  }

  updateUserDniRole(
    id: number,
    request: CoordinatorUpdateUserRequest
  ): Observable<ApiResponse<UserResponse>> {
    return this.http
      .put<ApiResponse<UserResponse>>(`${this.baseUrl}/users/coordinator/${id}`, request)
      .pipe(tap(() => this.cacheService.invalidate('/users')));
  }

  getDeletedUsers(): Observable<ApiResponse<UserResponse[]>> {
    return this.http.get<ApiResponse<UserResponse[]>>(`${this.baseUrl}/users/deleted`);
  }

  restoreUser(id: number): Observable<ApiResponse<UserResponse>> {
    return this.http
      .patch<ApiResponse<UserResponse>>(`${this.baseUrl}/users/${id}/restore`, {})
      .pipe(tap(() => this.cacheService.invalidate('/users')));
  }

  deleteUser(id: number): Observable<ApiResponse<void>> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/users/${id}`)
      .pipe(tap(() => this.cacheService.invalidate('/users')));
  }

  // ─── ESTUDIANTES ──────────────────────────────────────────────────────
  getStudents(): Observable<ApiResponse<StudentResponse[]>> {
    return this.http.get<ApiResponse<StudentResponse[]>>(`${this.baseUrl}/students`);
  }

  getDeletedStudents(): Observable<ApiResponse<StudentResponse[]>> {
    return this.http.get<ApiResponse<StudentResponse[]>>(`${this.baseUrl}/students/deleted`);
  }

  getStudentById(id: number): Observable<ApiResponse<StudentResponse>> {
    return this.http.get<ApiResponse<StudentResponse>>(`${this.baseUrl}/students/${id}`);
  }

  getStudentDetails(id: number): Observable<ApiResponse<StudentDetailResponse>> {
    return this.http.get<ApiResponse<StudentDetailResponse>>(
      `${this.baseUrl}/students/${id}/details`
    );
  }

  createStudent(request: CreateStudentRequest): Observable<ApiResponse<StudentResponse>> {
    return this.http
      .post<ApiResponse<StudentResponse>>(`${this.baseUrl}/students`, request)
      .pipe(tap(() => this.cacheService.invalidate('/students')));
  }

  updateStudent(
    id: number,
    request: UpdateStudentRequest
  ): Observable<ApiResponse<StudentResponse>> {
    return this.http
      .put<ApiResponse<StudentResponse>>(`${this.baseUrl}/students/${id}`, request)
      .pipe(tap(() => this.cacheService.invalidate('/students')));
  }

  deleteStudent(id: number): Observable<ApiResponse<void>> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/students/${id}`)
      .pipe(tap(() => this.cacheService.invalidate('/students')));
  }

  restoreStudent(id: number): Observable<ApiResponse<StudentResponse>> {
    return this.http
      .patch<ApiResponse<StudentResponse>>(`${this.baseUrl}/students/${id}/restore`, {})
      .pipe(tap(() => this.cacheService.invalidate('/students')));
  }

  searchStudents(query: string): Observable<ApiResponse<StudentResponse[]>> {
    return this.http.get<ApiResponse<StudentResponse[]>>(
      `${this.baseUrl}/students/search?query=${query}`
    );
  }

  getStudentsByParent(parentId: number): Observable<ApiResponse<StudentResponse[]>> {
    return this.http.get<ApiResponse<StudentResponse[]>>(
      `${this.baseUrl}/students/parent/${parentId}`
    );
  }

  // ─── CLASES ──────────────────────────────────────────────────────────
  getClasses(): Observable<ApiResponse<SchoolClassResponse[]>> {
    return this.http.get<ApiResponse<SchoolClassResponse[]>>(`${this.baseUrl}/classes`);
  }

  getClassById(id: number): Observable<ApiResponse<SchoolClassResponse>> {
    return this.http.get<ApiResponse<SchoolClassResponse>>(`${this.baseUrl}/classes/${id}`);
  }

  createClass(request: CreateClassRequest): Observable<ApiResponse<SchoolClassResponse>> {
    return this.http
      .post<ApiResponse<SchoolClassResponse>>(`${this.baseUrl}/classes`, request)
      .pipe(tap(() => this.cacheService.invalidate('/classes')));
  }

  updateClass(
    id: number,
    request: UpdateSchoolClassRequest
  ): Observable<ApiResponse<SchoolClassResponse>> {
    return this.http
      .put<ApiResponse<SchoolClassResponse>>(`${this.baseUrl}/classes/${id}`, request)
      .pipe(tap(() => this.cacheService.invalidate('/classes')));
  }

  addClassStudents(
    classId: number,
    request: AddStudentsRequest
  ): Observable<ApiResponse<SchoolClassResponse>> {
    return this.http
      .put<ApiResponse<SchoolClassResponse>>(`${this.baseUrl}/classes/${classId}/students`, request)
      .pipe(tap(() => this.cacheService.invalidate('/classes')));
  }

  deleteClass(id: number): Observable<ApiResponse<void>> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/classes/${id}`)
      .pipe(tap(() => this.cacheService.invalidate('/classes')));
  }

  restoreClass(id: number): Observable<ApiResponse<SchoolClassResponse>> {
    return this.http
      .put<ApiResponse<SchoolClassResponse>>(`${this.baseUrl}/classes/restore/${id}`, {})
      .pipe(tap(() => this.cacheService.invalidate('/classes')));
  }

  getClassStudents(classId: number): Observable<ApiResponse<StudentResponse[]>> {
    return this.http.get<ApiResponse<StudentResponse[]>>(
      `${this.baseUrl}/classes/${classId}/students`
    );
  }

  // ─── INCIDENCIAS ─────────────────────────────────────────────────────
  getIncidents(): Observable<ApiResponse<IncidentResponse[]>> {
    return this.http.get<ApiResponse<IncidentResponse[]>>(`${this.baseUrl}/incidents`);
  }

  getIncidentById(id: number): Observable<ApiResponse<IncidentResponse>> {
    return this.http.get<ApiResponse<IncidentResponse>>(`${this.baseUrl}/incidents/${id}`);
  }

  getIncidentsByClass(classId: number): Observable<ApiResponse<IncidentResponse[]>> {
    return this.http.get<ApiResponse<IncidentResponse[]>>(
      `${this.baseUrl}/incidents/class/${classId}`
    );
  }

  getIncidentsByStudent(studentId: number): Observable<ApiResponse<IncidentResponse[]>> {
    return this.http.get<ApiResponse<IncidentResponse[]>>(
      `${this.baseUrl}/incidents/student/${studentId}`
    );
  }
}
