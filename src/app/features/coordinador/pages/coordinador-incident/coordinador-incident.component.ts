import { Component, computed, inject, resource, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { CoordinadorApiService } from '../../services/coordinador-api.service';
import { IncidentResponse, IncidentStatus } from '../../models/incident-response.model';
import { PaginatorComponent } from '@shared/components/paginator/paginator.component';

@Component({
  selector: 'app-coordinador-incident',
  imports: [DatePipe, PaginatorComponent],
  templateUrl: './coordinador-incident.component.html',
  styleUrl: './coordinador-incident.component.css',
})
export class CoordinadorIncidentComponent {
  private readonly apiService = inject(CoordinadorApiService);

  // Filtros
  protected readonly search = signal('');
  protected readonly statusFilter = signal<'ALL' | IncidentStatus>('ALL');

  // Paginación
  protected readonly PAGE_SIZE = 10;
  protected readonly currentPage = signal(0);

  // Modal
  protected readonly selectedIncident = signal<IncidentResponse | null>(null);
  protected readonly isDetailOpen = signal(false);

  // Status constants for template
  protected readonly IncidentStatus = IncidentStatus;

  // Carga de datos
  protected readonly incidentsResource = resource({
    loader: async () => {
      const res = await firstValueFrom(this.apiService.getIncidents());
      return res.success ? res.data : [];
    },
  });

  protected readonly incidents = computed(() => this.incidentsResource.value() ?? []);

  // Filtrado reactivo
  protected readonly filteredIncidents = computed(() => {
    let result = this.incidents();
    const status = this.statusFilter();
    const term = this.search().trim().toLowerCase();

    if (status !== 'ALL') {
      result = result.filter((i) => i.status === status);
    }

    if (term) {
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(term) ||
          i.description.toLowerCase().includes(term) ||
          i.className.toLowerCase().includes(term) ||
          i.studentName.toLowerCase().includes(term) ||
          i.teacherName.toLowerCase().includes(term)
      );
    }

    return result;
  });

  // Lista paginada
  protected readonly paginatedIncidents = computed(() => {
    const filtered = this.filteredIncidents();
    const start = this.currentPage() * this.PAGE_SIZE;
    return filtered.slice(start, start + this.PAGE_SIZE);
  });


  // UI Handlers
  protected onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.search.set(target.value);
  }

  protected onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.statusFilter.set(target.value as 'ALL' | IncidentStatus);
  }

  protected openDetail(incident: IncidentResponse): void {
    this.selectedIncident.set(incident);
    this.isDetailOpen.set(true);
  }

  protected closeDetail(): void {
    this.isDetailOpen.set(false);
  }

  protected closeFromOverlay(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeDetail();
    }
  }
}
