import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { CoordinadorApiService } from '../../services/coordinador-api.service';
import type { StudentResponse } from '@core/auth/models/student-response.model';
import type { UserResponse } from '@core/auth/models/user-response.model';
import type { CreateClassRequest } from '@core/auth/models/school-class-response.model';

type ClassCard = {
  id: number;
  name: string;
  teacherName: string;
  teacherInitials: string;
  studentsCount: number;
  incidentsCount: number;
};

type StudentWithIncidents = StudentResponse & {
  incidentCount: number;
};

@Component({
  selector: 'app-coordinador-class',
  imports: [ReactiveFormsModule],
  templateUrl: './coordinador-class.component.html',
  styleUrl: './coordinador-class.component.css',
})
export class CoordinadorClassComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly coordinadorApiService = inject(CoordinadorApiService);

  protected readonly isLoading = signal(false);
  protected readonly isExporting = signal(false);
  protected readonly search = signal('');
  protected readonly classesList = signal<ClassCard[]>([]);

  // Class Creation Modal Signals
  protected readonly isCreateOpen = signal(false);
  protected readonly isSavingClass = signal(false);
  protected readonly teachers = signal<UserResponse[]>([]);

  // Details Modal Signals
  protected readonly isDetailOpen = signal(false);
  protected readonly isDetailLoading = signal(false);
  protected readonly detailClass = signal<ClassCard | null>(null);
  protected readonly detailStudents = signal<StudentWithIncidents[]>([]);

  // Add Students to Class Signals
  protected readonly isAddingStudents = signal(false);
  protected readonly isSavingAddedStudents = signal(false);
  protected readonly allActiveStudents = signal<StudentResponse[]>([]);
  protected readonly selectedStudentIds = signal<number[]>([]);
  protected readonly studentSearchQuery = signal('');

  // Class Form Definition
  protected readonly classForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    teacherId: [null as number | null, Validators.required],
  });

  protected readonly filteredClasses = computed(() => {
    const query = this.search().toLowerCase().trim();
    return this.classesList().filter(
      (c) => c.name.toLowerCase().includes(query) || c.teacherName.toLowerCase().includes(query)
    );
  });

  // Filter and show active students not currently in the selected class
  protected readonly availableStudents = computed(() => {
    const query = this.studentSearchQuery().toLowerCase().trim();
    const currentIds = new Set(this.detailStudents().map((s) => s.id));

    return this.allActiveStudents().filter((s) => {
      // Must not be in the class already
      if (currentIds.has(s.id)) return false;

      // Filter by search query
      if (!query) return true;
      return (
        s.firstName.toLowerCase().includes(query) ||
        s.lastName.toLowerCase().includes(query) ||
        s.studentCode.toLowerCase().includes(query) ||
        s.dni.includes(query)
      );
    });
  });

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading.set(true);
    forkJoin({
      classes: this.coordinadorApiService.getClasses(),
      incidents: this.coordinadorApiService.getIncidents(),
      teachers: this.coordinadorApiService.getTeachers(),
    }).subscribe({
      next: ({ classes, incidents, teachers }) => {
        this.isLoading.set(false);
        if (teachers.success) {
          // Filter to only include actual teachers just in case
          this.teachers.set(teachers.data);
        }
        if (classes.success && incidents.success) {
          const listIncidents = incidents.data;
          const mapped = classes.data.map((c) => {
            const classIncidents = listIncidents.filter((i) => i.classId === c.id);
            const tutorName = c.teacherName || 'Sin tutor';
            const initials = tutorName
              .split(' ')
              .map((n) => n.charAt(0))
              .join('')
              .toUpperCase()
              .substring(0, 2);

            return {
              id: c.id,
              name: c.name,
              teacherName: tutorName,
              teacherInitials: initials || 'ST',
              studentsCount: c.students ? c.students.length : 0,
              incidentsCount: classIncidents.length,
            };
          });
          this.classesList.set(mapped);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error loading coordinator classes data:', err);
      },
    });
  }

  protected onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.search.set(target.value);
  }

  // Class Creation Modal methods
  protected openCreateModal(): void {
    this.classForm.reset({
      name: '',
      teacherId: null,
    });
    this.isCreateOpen.set(true);
  }

  protected closeCreateModal(): void {
    this.isCreateOpen.set(false);
  }

  protected handleCreateClass(): void {
    if (this.classForm.invalid) {
      this.classForm.markAllAsTouched();
      return;
    }

    this.isSavingClass.set(true);
    const formValue = this.classForm.getRawValue();
    const request: CreateClassRequest = {
      name: formValue.name,
      teacherId: formValue.teacherId!,
      studentIds: [],
    };

    this.coordinadorApiService.createClass(request).subscribe({
      next: (res) => {
        this.isSavingClass.set(false);
        if (res.success) {
          this.isCreateOpen.set(false);
          this.loadData();
        }
      },
      error: (err) => {
        this.isSavingClass.set(false);
        console.error('Error creating class:', err);
        alert(err.error?.message || 'Error al crear el aula.');
      },
    });
  }

  // Details Modal methods
  protected openDetail(aula: ClassCard): void {
    // Reset add-students panel state
    this.isAddingStudents.set(false);
    this.selectedStudentIds.set([]);
    this.studentSearchQuery.set('');

    this.detailClass.set(aula);
    this.isDetailOpen.set(true);
    this.isDetailLoading.set(true);
    this.detailStudents.set([]);

    forkJoin({
      students: this.coordinadorApiService.getClassStudents(aula.id),
      incidents: this.coordinadorApiService.getIncidentsByClass(aula.id),
    }).subscribe({
      next: ({ students, incidents }) => {
        this.isDetailLoading.set(false);
        if (students.success && incidents.success) {
          const listIncidents = incidents.data;
          const mappedStudents = students.data.map((student) => {
            const count = listIncidents.filter((i) => i.studentId === student.id).length;
            return {
              ...student,
              incidentCount: count,
            };
          });
          this.detailStudents.set(mappedStudents);
        }
      },
      error: (err) => {
        this.isDetailLoading.set(false);
        console.error('Error loading class details:', err);
      },
    });
  }

  protected closeDetail(): void {
    this.isDetailOpen.set(false);
    this.detailClass.set(null);
    this.detailStudents.set([]);
    this.isAddingStudents.set(false);
    this.selectedStudentIds.set([]);
    this.studentSearchQuery.set('');
  }

  protected closeFromOverlay(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeDetail();
    }
  }

  protected closeCreateFromOverlay(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeCreateModal();
    }
  }

  // Student Assignment methods
  protected loadAllActiveStudents(): void {
    this.coordinadorApiService.getStudents().subscribe({
      next: (res) => {
        if (res.success) {
          this.allActiveStudents.set(res.data);
        }
      },
      error: (err) => {
        console.error('Error loading all active students:', err);
      },
    });
  }

  protected toggleAddStudentsSection(): void {
    const nextVal = !this.isAddingStudents();
    this.isAddingStudents.set(nextVal);
    if (nextVal) {
      this.selectedStudentIds.set([]);
      this.studentSearchQuery.set('');
      this.loadAllActiveStudents();
    }
  }

  protected toggleStudentSelection(id: number): void {
    const current = this.selectedStudentIds();
    if (current.includes(id)) {
      this.selectedStudentIds.set(current.filter((x) => x !== id));
    } else {
      this.selectedStudentIds.set([...current, id]);
    }
  }

  protected onStudentSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.studentSearchQuery.set(target.value);
  }

  protected handleAddStudents(): void {
    const selected = this.selectedStudentIds();
    if (selected.length === 0) {
      alert('Debe seleccionar al menos un estudiante.');
      return;
    }

    const currentClass = this.detailClass();
    if (!currentClass) return;

    this.isSavingAddedStudents.set(true);
    this.coordinadorApiService
      .addClassStudents(currentClass.id, { studentIds: selected })
      .subscribe({
        next: (res) => {
          this.isSavingAddedStudents.set(false);
          if (res.success) {
            this.isAddingStudents.set(false);
            this.selectedStudentIds.set([]);
            // Reload class details to reflect changes
            this.openDetail(currentClass);
            // Also reload main list to update count
            this.loadData();
          }
        },
        error: (err) => {
          this.isSavingAddedStudents.set(false);
          console.error('Error adding students to class:', err);
          alert(err.error?.message || 'Error al agregar los estudiantes.');
        },
      });
  }

  protected exportClassReport(classId: number): void {
    this.isExporting.set(true);
    this.coordinadorApiService.downloadClassIncidentReport(classId).subscribe({
      next: (blob) => {
        this.isExporting.set(false);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_incidencias_aula_${classId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.isExporting.set(false);
        console.error('Error exporting class PDF report:', err);
        alert('Error al descargar el reporte en PDF.');
      },
    });
  }
}
