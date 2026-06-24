import { Component, signal, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';

import  { StudentResponse } from '../../models/student-response.model';
import { UserResponse } from '../../models/user-response.model'
import { IncidentResponse } from '../../models/incident-response.model'

export type Student = StudentResponse & {
  isDeleted: boolean;
}

export type Parent = UserResponse;
  

export type StudentDetail = Student & {
  parentEmail: string;
  parentPhone: string;
  className: string;
  incidents: Array<IncidentResponse & { status: 'NO_LEIDA' | 'LEIDA'}>;
};

@Component({
  selector: 'app-coordinador-student',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './coordinador-student.component.html',
  styleUrl: './coordinador-student.component.css',
})
export class CoordinadorStudentComponent {
  private readonly fb = inject(NonNullableFormBuilder);

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
    const showDel = this.showDeleted();

    return this.students().filter((student) => {
      // Filtrado por estado de soft-delete
      if (student.isDeleted !== showDel) {
        return false;
      }

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

  // UI Handlers
  protected onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.search.set(target.value);
  }

  protected toggleShowDeleted(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.showDeleted.set(target.checked);
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

    // Simulamos carga asíncrona de ficha de estudiante
    setTimeout(() => {
      const parent = this.parents().find((p) => p.id === student.parentId);
      this.detailStudent.set({
        ...student,
        parentEmail: parent?.email ?? '',
        parentPhone: '',
        className: '',
        incidents: [],
      });
      this.isDetailLoading.set(false);
    }, 400);
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

  protected handleSave(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);

    // Simular guardado
    setTimeout(() => {
      const formValue = this.studentForm.getRawValue();
      const parent = this.parents().find((p) => p.id === formValue.parentId);
      const parentName = parent?.name ?? '—';

      const toEdit = this.studentToEdit();
      if (toEdit) {
        // Modo Edición
        this.students.update((list) =>
          list.map((s) =>
            s.id === toEdit.id
              ? {
                  ...s,
                  firstName: formValue.firstName,
                  lastName: formValue.lastName,
                  dni: formValue.dni,
                  parentId: formValue.parentId!,
                  parentName,
                }
              : s
          )
        );
      } else {
        // Modo Registro
        const nextId = Math.max(...this.students().map((s) => s.id), 0) + 1;
        const codeNum = String(nextId).padStart(3, '0');
        const newStudent: Student = {
          id: nextId,
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          dni: formValue.dni,
          studentCode: `EST${codeNum}`,
          parentId: formValue.parentId!,
          parentName,
          isDeleted: false,
        };
        this.students.update((list) => [newStudent, ...list]);
      }

      this.isSaving.set(false);
      this.isFormOpen.set(false);
    }, 500);
  }

  protected handleDelete(): void {
    const student = this.selectedStudent();
    if (!student) return;

    this.isActionLoading.set(true);
    setTimeout(() => {
      this.students.update((list) =>
        list.map((s) => (s.id === student.id ? { ...s, isDeleted: true } : s))
      );
      this.isActionLoading.set(false);
      this.isDeleteOpen.set(false);
    }, 450);
  }

  protected handleRestore(): void {
    const student = this.selectedStudent();
    if (!student) return;

    this.isActionLoading.set(true);
    setTimeout(() => {
      this.students.update((list) =>
        list.map((s) => (s.id === student.id ? { ...s, isDeleted: false } : s))
      );
      this.isActionLoading.set(false);
      this.isRestoreOpen.set(false);
    }, 450);
  }
}
