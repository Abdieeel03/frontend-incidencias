import { Component, signal, computed } from '@angular/core';
import { ProfesorHeaderComponent } from '../../components/profesor-header/profesor-header.component';

interface IncidenciaMock {
  id: number;
  codigo: string;
  estudiante: string;
  avatarUrl?: string;
  titulo: string;
  descripcion: string;
  aula: string;      
  estado: 'abierta' | 'en_proceso' | 'resuelta' | 'archivada';
  fecha: string;
  hora: string;
}

@Component({
  selector: 'app-incidencias',
  imports: [ProfesorHeaderComponent],
  templateUrl: './incidencias.component.html',
  styleUrl: './incidencias.component.css'
})
export class IncidenciasComponent {
  incidencias = signal<IncidenciaMock[]>([
    {
      id: 1,
      codigo: '#INC-081',
      estudiante: 'Ana Martínez',
      titulo: 'Interrupción reiterada',
      descripcion: 'El estudiante interrumpió de manera reiterada la clase de matemáticas levantándose de su asiento sin autorización.',
      aula: '4to A - Matemáticas',
      estado: 'abierta',
      fecha: '15 Oct 2024',
      hora: '10:30 AM'
    },
    {
      id: 2,
      codigo: '#INC-080',
      estudiante: 'Carlos López',
      titulo: 'Daño a propiedad',
      descripcion: 'Rayó la carpeta del salón con un lapicero durante las horas de Tutoría.',
      aula: '4to A - Tutoría',
      estado: 'en_proceso',
      fecha: '14 Oct 2024',
      hora: '11:15 AM'
    },
    {
      id: 3,
      codigo: '#INC-078',
      estudiante: 'Sofía Ramírez',
      titulo: 'Falta Disciplinaria',
      descripcion: 'Llegó con 20 minutos de tardanza y no justificó su ingreso a la clase de inglés.',
      aula: '5to B - Inglés',
      estado: 'resuelta',
      fecha: '12 Oct 2024',
      hora: '08:45 AM'
    },
    {
      id: 4,
      codigo: '#INC-077',
      estudiante: 'Miguel Torres',
      titulo: 'Incumplimiento de Tarea',
      descripcion: 'No presentó el proyecto final del curso a pesar de la prórroga otorgada de 2 días.',
      aula: '6to A - Ciencias',
      estado: 'archivada',
      fecha: '10 Oct 2024',
      hora: '09:00 AM'
    }
  ]);


  filtroEstado = signal<string>('todos');
  busqueda = signal<string>('');
  

  incidenciaSeleccionada = signal<IncidenciaMock | null>(null);


  incidenciasFiltradas = computed(() => {
    const query = this.busqueda().toLowerCase().trim();
    const estado = this.filtroEstado();
    
    return this.incidencias().filter(inc => {
      const coincideEstado = estado === 'todos' || inc.estado === estado;
      const coincideBusqueda = !query || 
        inc.estudiante.toLowerCase().includes(query) || 
        inc.titulo.toLowerCase().includes(query) ||
        inc.codigo.toLowerCase().includes(query);
        
      return coincideEstado && coincideBusqueda;
    });
  });


  setFiltro(estado: string): void {
    this.filtroEstado.set(estado);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.busqueda.set(input.value);
  }

  abrirModal(incidencia: IncidenciaMock): void {
    this.incidenciaSeleccionada.set(incidencia);
  }

  cerrarModal(): void {
    this.incidenciaSeleccionada.set(null);
  }
}