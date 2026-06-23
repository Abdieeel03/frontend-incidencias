import { DatePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

type Child = {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly studentCode: string;
};

type Incident = {
  readonly id: number;
  readonly studentId: number;
  readonly title: string;
  readonly description: string;
  readonly status: 'NO_LEIDA' | 'LEIDA';
  readonly incidentDate: string;
};

const MOCK_CHILDREN: readonly Child[] = [
  { id: 1, firstName: 'Valentina', lastName: 'Ramirez', studentCode: 'EST-2026-014' },
  { id: 2, firstName: 'Mateo', lastName: 'Ramirez', studentCode: 'EST-2026-029' },
];

const MOCK_INCIDENTS: readonly Incident[] = [
  {
    id: 101,
    studentId: 1,
    title: 'Llegada tarde a clase',
    description: 'Se registró ingreso posterior al inicio de la primera hora académica.',
    status: 'NO_LEIDA',
    incidentDate: '2026-06-22T08:15:00',
  },
  {
    id: 102,
    studentId: 1,
    title: 'Participación destacada',
    description: 'Participó activamente en la actividad de convivencia del aula.',
    status: 'LEIDA',
    incidentDate: '2026-06-18T10:30:00',
  },
  {
    id: 103,
    studentId: 1,
    title: 'Material incompleto',
    description: 'No presentó el cuaderno requerido para la sesión.',
    status: 'LEIDA',
    incidentDate: '2026-06-12T09:40:00',
  },
  {
    id: 201,
    studentId: 2,
    title: 'Reporte de conducta resuelto',
    description: 'Se conversó con el estudiante y se cerró el seguimiento del caso.',
    status: 'LEIDA',
    incidentDate: '2026-06-20T11:00:00',
  },
];

@Component({
  selector: 'app-padre-children-incidents',
  imports: [DatePipe],
  templateUrl: './padre-children-incidents.component.html',
  styleUrl: './padre-children-incidents.component.css',
})
export class PadreChildrenIncidentsComponent {
  protected readonly children = signal(MOCK_CHILDREN);
  protected readonly actionLoadingId = signal<number | null>(null);
  protected readonly incidents = signal(MOCK_INCIDENTS);

  protected readonly selectedChildId = signal(this.getInitialChildId());

  protected readonly selectedChild = computed(() =>
    this.children().find((child) => child.id === this.selectedChildId()) ?? null
  );

  protected readonly selectedIncidents = computed(() =>
    this.incidents()
      .filter((incident) => incident.studentId === this.selectedChildId())
      .sort(
        (a, b) => new Date(b.incidentDate).getTime() - new Date(a.incidentDate).getTime()
      )
  );

  protected selectChild(childId: number): void {
    this.selectedChildId.set(childId);
  }

  protected markAsRead(incidentId: number): void {
    this.actionLoadingId.set(incidentId);
    this.incidents.update((incidents) =>
      incidents.map((incident) =>
        incident.id === incidentId ? { ...incident, status: 'LEIDA' } : incident
      )
    );
    this.actionLoadingId.set(null);
  }

  private getInitialChildId(): number | null {
    const selectedStudentId = Number(globalThis.history?.state?.selectedStudentId);
    const childExists = MOCK_CHILDREN.some((child) => child.id === selectedStudentId);

    return childExists ? selectedStudentId : MOCK_CHILDREN[0]?.id ?? null;
  }
}
