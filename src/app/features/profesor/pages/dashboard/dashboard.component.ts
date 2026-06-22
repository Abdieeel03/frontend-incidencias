import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfesorHeaderComponent } from '../../components/profesor-header/profesor-header.component';

interface IncidenciaReciente {
  id: number;
  codigo: string;
  estudiante: string;
  titulo: string;
  descripcion: string;
  aula: string;
  estado: 'abierta' | 'en_proceso' | 'resuelta' | 'archivada';
  fecha: string;
  hora: string;
}

interface SalonResumen {
  id: number;
  nombre: string;
  materia: string;
  estadoLabel: string;
  estadoTipo: 'danger' | 'warning' | 'info';
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, ProfesorHeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  salones = signal<SalonResumen[]>([
    { id: 1, nombre: '4to A', materia: 'Tutoría', estadoLabel: '2 Activas', estadoTipo: 'danger' },
    { id: 2, nombre: '5to B', materia: 'Matemáticas', estadoLabel: '0 Activas', estadoTipo: 'info' },
    { id: 3, nombre: '6to A', materia: 'Ciencias', estadoLabel: '3 Pendientes', estadoTipo: 'warning' }
  ]);

  incidencias = signal<IncidenciaReciente[]>([
    {
      id: 1,
      codigo: '#INC-1042',
      estudiante: 'Alejandro Ramírez',
      titulo: 'Interrupción reiterada',
      descripcion: 'El estudiante interrumpió de manera reiterada la clase de matemáticas levantándose de su asiento sin autorización.',
      aula: '4to A - Matemáticas',
      estado: 'abierta',
      fecha: '22 Jun 2026',
      hora: '10:30 AM'
    },
    {
      id: 2,
      codigo: '#INC-1041',
      estudiante: 'Valentina Martínez',
      titulo: 'Llegada tarde injustificada',
      descripcion: 'Llegó al aula con 25 minutos de retraso sin justificación escrita.',
      aula: '5to B - Inglés',
      estado: 'en_proceso',
      fecha: '22 Jun 2026',
      hora: '08:15 AM'
    },
    {
      id: 3,
      codigo: '#INC-1040',
      estudiante: 'Sebastián Fernández',
      titulo: 'Discusión en clase',
      descripcion: 'Mantuvo una discusión verbal subida de tono con otro compañero durante el trabajo en equipos.',
      aula: '4to A - Tutoría',
      estado: 'resuelta',
      fecha: '21 Jun 2026',
      hora: '11:45 AM'
    }
  ]);

  busqueda = signal<string>('');
  incidenciaSeleccionada = signal<IncidenciaReciente | null>(null);

  incidenciasFiltradas = computed(() => {
    const query = this.busqueda().toLowerCase().trim();
    if (!query) return this.incidencias();

    return this.incidencias().filter(inc => 
      inc.estudiante.toLowerCase().includes(query) ||
      inc.titulo.toLowerCase().includes(query) ||
      inc.codigo.toLowerCase().includes(query)
    );
  });

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.busqueda.set(input.value);
  }

  abrirModal(incidencia: IncidenciaReciente): void {
    this.incidenciaSeleccionada.set(incidencia);
  }

  cerrarModal(): void {
    this.incidenciaSeleccionada.set(null);
  }
}