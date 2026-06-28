import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { PadreApiService } from '@features/padre/services/padre-api.service';
import { IncidentResponse } from '@core/auth/models/incident-response.model';

type Child = {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly studentCode: string;
};

@Component({
  selector: 'app-padre-children-incidents',
  imports: [DatePipe],
  templateUrl: './padre-children-incidents.component.html',
  styleUrl: './padre-children-incidents.component.css',
})
export class PadreChildrenIncidentsComponent implements OnInit {
  private readonly padreApiService = inject(PadreApiService);

  protected readonly children = signal<Child[]>([]);
  protected readonly actionLoadingId = signal<number | null>(null);
  protected readonly incidents = signal<IncidentResponse[]>([]);

  protected readonly selectedChildId = signal<number | null>(null);

  protected readonly selectedChild = computed(
    () => this.children().find((child) => child.id === this.selectedChildId()) ?? null
  );

  protected readonly selectedIncidents = computed(() =>
    this.incidents()
      .filter((incident) => incident.studentId === this.selectedChildId())
      .sort((a, b) => new Date(b.incidentDate).getTime() - new Date(a.incidentDate).getTime())
  );

  ngOnInit(): void {
    this.padreApiService.getMyChildren().subscribe({
      next: (res) => {
        if (res.success) {
          const list = res.data.map((c) => ({
            id: c.id,
            firstName: c.firstName,
            lastName: c.lastName,
            studentCode: c.studentCode,
          }));
          this.children.set(list);

          const initialId = this.getInitialChildId(list);
          if (initialId !== null) {
            this.selectedChildId.set(initialId);
            this.loadIncidentsForChild(initialId);
          }
        }
      },
      error: (err) => console.error('Error loading children list:', err),
    });
  }

  private loadIncidentsForChild(childId: number): void {
    this.padreApiService.getIncidentsByStudent(childId).subscribe({
      next: (res) => {
        if (res.success) {
          this.incidents.set(res.data);
        }
      },
      error: (err) => console.error('Error loading incidents for child:', err),
    });
  }

  protected selectChild(childId: number): void {
    this.selectedChildId.set(childId);
    this.loadIncidentsForChild(childId);
  }

  protected markAsRead(incidentId: number): void {
    this.actionLoadingId.set(incidentId);
    this.padreApiService.markAsRead(incidentId).subscribe({
      next: (res) => {
        this.actionLoadingId.set(null);
        if (res.success) {
          this.incidents.update((incidents) =>
            incidents.map((incident) =>
              incident.id === incidentId ? { ...incident, status: 'LEIDA' } : incident
            )
          );
        }
      },
      error: (err) => {
        this.actionLoadingId.set(null);
        console.error('Error marking incident as read:', err);
      },
    });
  }

  private getInitialChildId(list: Child[]): number | null {
    const selectedStudentId = Number(globalThis.history?.state?.selectedStudentId);
    const childExists = list.some((child) => child.id === selectedStudentId);

    return childExists ? selectedStudentId : (list[0]?.id ?? null);
  }
}
