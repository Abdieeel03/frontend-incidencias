import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { CoordinadorApiService } from '../../services/coordinador-api.service';
import {
  StudentResponse,
  CreateStudentRequest,
  UpdateStudentRequest,
} from '@core/auth/models/student-response.model';
import { UserResponse } from '@core/auth/models/user-response.model';
import { PaginatorComponent } from '@shared/components/paginator/paginator.component';

export type Student = StudentResponse;

export type Parent = UserResponse;

export type StudentDetail = StudentResponse & {
  parentEmail: string;
  className: string;
  incidents: {
    id: number;
    title: string;
    description: string;
    incidentDate: string;
    status: 'NO_LEIDA' | 'LEIDA';
  }[];
};

@Component({
  selector: 'app-coordinador-student',
  imports: [ReactiveFormsModule, DatePipe, PaginatorComponent],
  templateUrl: './coordinador-student.component.html',
  styleUrl: './coordinador-student.component.css',
})
export class CoordinadorStudentComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly coordinadorApiService = inject(CoordinadorApiService);

  // Writable Signals
  protected readonly isLoading = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly isDetailLoading = signal(false);
  protected readonly isActionLoading = signal(false);

  // Modales
  protected readonly isFormOpen = signal(false);
  protected readonly isDetailOpen = signal(false);
  protected readonly isDeleteOpen = signal(false);
  protected readonly isRestoreOpen = signal(false);

  // Paginación
  protected readonly PAGE_SIZE = 10;
  protected readonly currentPage = signal(0);

  // Data Signals
  protected readonly students = signal<Student[]>([]);
  protected readonly parents = signal<Parent[]>([]);

  // Selections & Filters
  protected readonly search = signal('');
  protected readonly showDeleted = signal(false);
  protected readonly studentToEdit = signal<Student | null>(null);
  protected readonly selectedStudent = signal<Student | null>(null);
  protected readonly detailStudent = signal<StudentDetail | null>(null);

  // Form definition
  protected readonly studentForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    parentId: [null as number | null, Validators.required],
  });

  // Filtered Students
  protected readonly filteredStudents = computed(() => {
    const term = this.search().trim().toLowerCase();

    return this.students().filter((student) => {
      // Filtrado por término de búsqueda
      if (!term) {
        return true;
      }

      return (
        student.firstName.toLowerCase().includes(term) ||
        student.lastName.toLowerCase().includes(term) ||
        student.studentCode.toLowerCase().includes(term) ||
        student.dni.includes(term) ||
        student.parentName.toLowerCase().includes(term)
      );
    });
  });

  // Lista paginada
  protected readonly paginatedStudents = computed(() => {
    const filtered = this.filteredStudents();
    const start = this.currentPage() * this.PAGE_SIZE;
    return filtered.slice(start, start + this.PAGE_SIZE);
  });


  ngOnInit(): void {
    this.loadStudents();
    this.loadParents();
  }

  protected loadStudents(): void {
    this.isLoading.set(true);
    const request$ = this.showDeleted()
      ? this.coordinadorApiService.getDeletedStudents()
      : this.coordinadorApiService.getStudents();

    request$.subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.students.set(res.data);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error loading students:', err);
      },
    });
  }

  private loadParents(): void {
    this.coordinadorApiService.getParents().subscribe({
      next: (res) => {
        if (res.success) {
          this.parents.set(res.data);
        }
      },
      error: (err) => {
        console.error('Error loading parents:', err);
      },
    });
  }

  // UI Handlers
  protected onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.search.set(target.value);
  }

  protected toggleShowDeleted(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.showDeleted.set(target.checked);
    this.loadStudents();
  }

  protected openCreateForm(): void {
    this.studentToEdit.set(null);
    this.studentForm.reset();
    this.isFormOpen.set(true);
  }

  protected openEditForm(student: Student): void {
    this.studentToEdit.set(student);
    this.studentForm.setValue({
      firstName: student.firstName,
      lastName: student.lastName,
      dni: student.dni,
      parentId: student.parentId,
    });
    this.isFormOpen.set(true);
  }

  protected openDetails(student: Student): void {
    this.isDetailLoading.set(true);
    this.isDetailOpen.set(true);

    forkJoin({
      details: this.coordinadorApiService.getStudentDetails(student.id),
      incidents: this.coordinadorApiService.getIncidentsByStudent(student.id),
    }).subscribe({
      next: ({ details, incidents }) => {
        this.isDetailLoading.set(false);
        if (details.success && incidents.success) {
          const parent = this.parents().find((p) => p.id === student.parentId);
          const className = details.data.classes?.map((c) => c.name).join(', ') || 'Sin sección';
          const mappedIncidents = incidents.data.map((i) => ({
            id: i.id,
            title: i.title,
            description: i.description,
            incidentDate: i.incidentDate,
            status: i.status as 'NO_LEIDA' | 'LEIDA',
          }));

          this.detailStudent.set({
            ...student,
            parentEmail: parent?.email ?? '—',
            className,
            incidents: mappedIncidents,
          });
        }
      },
      error: (err) => {
        this.isDetailLoading.set(false);
        console.error('Error loading student details:', err);
        alert(err.error?.message || 'Error al cargar los detalles del estudiante.');
      },
    });
  }

  protected openDeleteConfirm(student: Student): void {
    this.selectedStudent.set(student);
    this.isDeleteOpen.set(true);
  }

  protected openRestoreConfirm(student: Student): void {
    this.selectedStudent.set(student);
    this.isRestoreOpen.set(true);
  }

  protected closeAllModals(): void {
    this.isFormOpen.set(false);
    this.isDetailOpen.set(false);
    this.isDeleteOpen.set(false);
    this.isRestoreOpen.set(false);
  }

  protected closeFromOverlay(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeAllModals();
    }
  }

  protected handleSave(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const formValue = this.studentForm.getRawValue();
    const toEdit = this.studentToEdit();

    if (toEdit) {
      // Modo Edición
      const request: UpdateStudentRequest = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        dni: formValue.dni,
        parentId: formValue.parentId!,
      };
      this.coordinadorApiService.updateStudent(toEdit.id, request).subscribe({
        next: (res) => {
          this.isSaving.set(false);
          if (res.success) {
            this.isFormOpen.set(false);
            this.loadStudents();
          }
        },
        error: (err) => {
          this.isSaving.set(false);
          console.error('Error updating student:', err);
          alert(err.error?.message || 'Error al actualizar el estudiante.');
        },
      });
    } else {
      // Modo Registro
      const request: CreateStudentRequest = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        dni: formValue.dni,
        parentId: formValue.parentId!,
      };
      this.coordinadorApiService.createStudent(request).subscribe({
        next: (res) => {
          this.isSaving.set(false);
          if (res.success) {
            this.isFormOpen.set(false);
            this.loadStudents();
          }
        },
        error: (err) => {
          this.isSaving.set(false);
          console.error('Error creating student:', err);
          alert(err.error?.message || 'Error al registrar el estudiante.');
        },
      });
    }
  }

  protected handleDelete(): void {
    const student = this.selectedStudent();
    if (!student) return;

    this.isActionLoading.set(true);
    this.coordinadorApiService.deleteStudent(student.id).subscribe({
      next: (res) => {
        this.isActionLoading.set(false);
        if (res.success) {
          this.isDeleteOpen.set(false);
          this.loadStudents();
        }
      },
      error: (err) => {
        this.isActionLoading.set(false);
        console.error('Error deleting student:', err);
        alert(err.error?.message || 'Error al retirar el estudiante.');
      },
    });
  }

  protected handleRestore(): void {
    const student = this.selectedStudent();
    if (!student) return;

    this.isActionLoading.set(true);
    this.coordinadorApiService.restoreStudent(student.id).subscribe({
      next: (res) => {
        this.isActionLoading.set(false);
        if (res.success) {
          this.isRestoreOpen.set(false);
          this.loadStudents();
        }
      },
      error: (err) => {
        this.isActionLoading.set(false);
        console.error('Error restoring student:', err);
        alert(err.error?.message || 'Error al restaurar el estudiante.');
      },
    });
  }
}
