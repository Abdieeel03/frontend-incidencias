import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { ProfesorApiService } from '@features/profesor/services/profesor-api.service';
import {
  IncidenciaFormComponent,
  type IncidenciaFormValue,
} from '../incidencia-form/incidencia-form.component';
import { IncidentResponse } from '@core/auth/models/incident-response.model';

type SalonResumen = {
  id: number;
  nombre: string;
  materia: string;
  estadoLabel: string;
  estadoTipo: 'danger' | 'warning' | 'info';
};

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, IncidenciaFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private readonly profesorApiService = inject(ProfesorApiService);

  salones = signal<SalonResumen[]>([]);
  incidencias = signal<IncidentResponse[]>([]);

  busqueda = signal<string>('');
  incidenciaSeleccionada = signal<IncidentResponse | null>(null);
  mostrarFormModal = signal<boolean>(false);
  idParaEditar = signal<number | null>(null);

  // Stats computed from active incidents list
  readonly openCount = computed(
    () => this.incidencias().filter((i) => i.status === 'NO_LEIDA').length
  );
  readonly resolvedCount = computed(
    () => this.incidencias().filter((i) => i.status === 'LEIDA').length
  );

  incidenciasFiltradas = computed(() => {
    const query = this.busqueda().toLowerCase().trim();
    const list = this.incidencias();
    if (!query) return list;

    return list.filter(
      (inc) =>
        inc.studentName.toLowerCase().includes(query) ||
        inc.title.toLowerCase().includes(query) ||
        inc.id.toString().includes(query)
    );
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    forkJoin({
      classes: this.profesorApiService.getMyClasses(),
      incidents: this.profesorApiService.getMyIncidents(),
    }).subscribe({
      next: ({ classes, incidents }) => {
        if (classes.success && incidents.success) {
          const incidentsList = incidents.data;

          // Map classes for dashboard UI
          const processedClasses = classes.data.map((c) => {
            const classIncidents = incidentsList.filter((i) => i.classId === c.id);
            const noLeidas = classIncidents.filter((i) => i.status === 'NO_LEIDA').length;
            return {
              id: c.id,
              nombre: c.name,
              materia: 'Clase Asignada',
              estadoLabel: noLeidas > 0 ? `${noLeidas} Sin Leer` : '0 Sin Leer',
              estadoTipo: noLeidas > 0 ? ('danger' as const) : ('info' as const),
            };
          });
          this.salones.set(processedClasses);

          // Update incidents list
          this.incidencias.set(incidentsList);
        }
      },
      error: (err) => console.error('Error loading dashboard data:', err),
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.busqueda.set(input.value);
  }

  abrirModal(incidencia: IncidentResponse): void {
    this.incidenciaSeleccionada.set(incidencia);
  }

  cerrarModal(): void {
    this.incidenciaSeleccionada.set(null);
  }

  closeModalFromOverlay(event: Event): void {
    if (event.target === event.currentTarget) {
      this.cerrarModal();
    }
  }

  abrirFormularioCrear(): void {
    this.idParaEditar.set(null);
    this.mostrarFormModal.set(true);
  }

  abrirFormularioEditar(id: number): void {
    this.idParaEditar.set(id);
    this.mostrarFormModal.set(true);
  }

  cerrarFormulario(): void {
    this.mostrarFormModal.set(false);
    this.idParaEditar.set(null);
  }

  guardarIncidencia(datos: IncidenciaFormValue): void {
    const id = this.idParaEditar();
    if (id !== null) {
      this.profesorApiService.updateIncident(id, datos).subscribe({
        next: (res) => {
          if (res.success) {
            this.loadData();
            this.cerrarFormulario();
          }
        },
        error: (err) => {
          console.error('Error updating incident:', err);
          alert(err.error?.message || 'Error al actualizar la incidencia.');
        },
      });
    } else {
      this.profesorApiService.createIncident(datos).subscribe({
        next: (res) => {
          if (res.success) {
            this.loadData();
            this.cerrarFormulario();
          }
        },
        error: (err) => {
          console.error('Error creating incident:', err);
          alert(err.error?.message || 'Error al crear la incidencia.');
        },
      });
    }
  }
}
