import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ProfesorApiService } from '@features/profesor/services/profesor-api.service';
import { forkJoin } from 'rxjs';
import { StudentResponse } from '@core/auth/models/student-response.model';

type Aula = {
  id: number;
  nombre: string;
  nivel: string;
  alumnosCount: number;
  noLeidasCount: number;
  leidasCount: number;
};

@Component({
  selector: 'app-aulas',
  imports: [],
  templateUrl: './aulas.component.html',
  styleUrl: './aulas.component.css',
})
export class AulasComponent implements OnInit {
  private readonly profesorApiService = inject(ProfesorApiService);
  private readonly router = inject(Router);

  readonly classes = signal<Aula[]>([]);
  readonly filterNivel = signal<string>('todos');

  readonly isDetailsModalOpen = signal(false);
  readonly selectedAulaDetails = signal<Aula | null>(null);
  readonly studentsInSelectedAula = signal<StudentResponse[]>([]);
  readonly studentSearchQuery = signal('');

  readonly isExportingClass = signal(false);
  readonly exportingStudentCode = signal<string | null>(null);

  readonly filteredClasses = computed(() => {
    const nivel = this.filterNivel();
    const classList = this.classes();

    return classList.filter((c) => {
      const cNivel = c.nombre.toLowerCase().includes('primaria') ? 'primaria' : 'secundaria';
      return nivel === 'todos' || cNivel === nivel;
    });
  });

  readonly filteredStudents = computed(() => {
    const query = this.studentSearchQuery().toLowerCase();
    const students = this.studentsInSelectedAula();
    if (!query) return students;
    return students.filter(
      (s) =>
        s.firstName.toLowerCase().includes(query) ||
        s.lastName.toLowerCase().includes(query) ||
        s.dni.includes(query) ||
        (s.studentCode && s.studentCode.toLowerCase().includes(query))
    );
  });

  ngOnInit(): void {
    forkJoin({
      classes: this.profesorApiService.getMyClasses(),
      incidents: this.profesorApiService.getMyIncidents(),
    }).subscribe({
      next: ({ classes, incidents }) => {
        if (classes.success && incidents.success) {
          const incidentsList = incidents.data;
          const processedClasses = classes.data.map((c) => {
            const classIncidents = incidentsList.filter((i) => i.classId === c.id);
            const noLeidas = classIncidents.filter((i) => i.status === 'NO_LEIDA').length;
            const leidas = classIncidents.filter((i) => i.status === 'LEIDA').length;
            return {
              id: c.id,
              nombre: c.name,
              nivel: c.name.toLowerCase().includes('primaria') ? 'Primaria' : 'Secundaria',
              alumnosCount: c.students ? c.students.length : 0,
              noLeidasCount: noLeidas,
              leidasCount: leidas,
            };
          });
          this.classes.set(processedClasses);
        }
      },
      error: (err) => {
        console.error('Error loading classes details:', err);
      },
    });
  }

  onNivelChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filterNivel.set(select.value);
  }

  openDetails(aula: Aula): void {
    this.selectedAulaDetails.set(aula);
    this.isDetailsModalOpen.set(true);
    this.studentSearchQuery.set('');

    // Load students for this class
    this.profesorApiService.getClassStudents(aula.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.studentsInSelectedAula.set(res.data);
        }
      },
      error: (err) => console.error('Error loading students for class:', err),
    });
  }

  closeDetailsModal(): void {
    this.isDetailsModalOpen.set(false);
    this.selectedAulaDetails.set(null);
    this.studentsInSelectedAula.set([]);
  }

  onStudentSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.studentSearchQuery.set(input.value);
  }

  createIncidentForStudent(student: StudentResponse): void {
    const aula = this.selectedAulaDetails();
    if (!aula) return;

    // Redirect to incidencias page with query params to open the form
    this.router.navigate(['/profesor/incidencias'], {
      queryParams: {
        action: 'new',
        classId: aula.id,
        studentDni: student.dni,
      },
    });
  }

  exportClassReport(classId: number): void {
    this.isExportingClass.set(true);
    this.profesorApiService.downloadClassIncidentReport(classId).subscribe({
      next: (blob) => {
        this.isExportingClass.set(false);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_incidencias_aula_${classId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.isExportingClass.set(false);
        console.error('Error exporting class PDF report:', err);
        alert('Error al descargar el reporte en PDF.');
      },
    });
  }

  exportStudentReport(studentCode: string): void {
    this.exportingStudentCode.set(studentCode);
    this.profesorApiService.downloadStudentIncidentReport(studentCode).subscribe({
      next: (blob) => {
        this.exportingStudentCode.set(null);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_incidencias_${studentCode}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.exportingStudentCode.set(null);
        console.error('Error exporting student PDF report:', err);
        alert('Error al descargar el reporte individual en PDF.');
      },
    });
  }
}
