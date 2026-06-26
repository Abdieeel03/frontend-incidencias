import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ProfesorApiService } from '@features/profesor/services/profesor-api.service';
import { IncidentResponse } from '@core/auth/models/incident-response.model';
import { IncidenciaFormComponent, type IncidenciaFormValue } from '../incidencia-form/incidencia-form.component';

@Component({
  selector: 'app-incidencias',
  imports: [IncidenciaFormComponent, DecimalPipe],
  templateUrl: './incidencias.component.html',
  styleUrl: './incidencias.component.css'
})
export class IncidenciasComponent implements OnInit {
  private readonly profesorApiService = inject(ProfesorApiService);
  private readonly route = inject(ActivatedRoute);

  incidencias = signal<IncidentResponse[]>([]);
  filtroEstado = signal<string>('todos');
  busqueda = signal<string>('');
  
  incidenciaSeleccionada = signal<IncidentResponse | null>(null);
  mostrarFormModal = signal<boolean>(false);
  idParaEditar = signal<number | null>(null);

  readonly openCount = computed(() => this.incidencias().filter(i => i.status === 'NO_LEIDA').length);
  readonly resolvedCount = computed(() => this.incidencias().filter(i => i.status === 'LEIDA').length);

  incidenciasFiltradas = computed(() => {
    const query = this.busqueda().toLowerCase().trim();
    const estado = this.filtroEstado();
    
    return this.incidencias().filter(inc => {
      const coincideEstado = estado === 'todos' || inc.status === estado;
      const coincideBusqueda = !query || 
        inc.studentName.toLowerCase().includes(query) || 
        inc.title.toLowerCase().includes(query) ||
        inc.id.toString().includes(query);
        
      return coincideEstado && coincideBusqueda;
    });
  });

  ngOnInit(): void {
    this.loadIncidents();
    
    this.route.queryParams.subscribe(params => {
      if (params['action'] === 'new') {
        this.abrirFormularioCrear();
      }
    });
  }

  loadIncidents(): void {
    this.profesorApiService.getMyIncidents().subscribe({
      next: (res) => {
        if (res.success) {
          this.incidencias.set(res.data);
        }
      },
      error: (err) => console.error('Error loading incidents:', err)
    });
  }

  setFiltro(estado: string): void {
    this.filtroEstado.set(estado);
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
            this.loadIncidents();
            this.cerrarFormulario();
          }
        },
        error: (err) => {
          console.error('Error updating incident:', err);
          alert(err.error?.message || 'Error al actualizar la incidencia.');
        }
      });
    } else {
      this.profesorApiService.createIncident(datos).subscribe({
        next: (res) => {
          if (res.success) {
            this.loadIncidents();
            this.cerrarFormulario();
          }
        },
        error: (err) => {
          console.error('Error creating incident:', err);
          alert(err.error?.message || 'Error al crear la incidencia.');
        }
      });
    }
  }
}
