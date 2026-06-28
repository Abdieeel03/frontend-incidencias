import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { PadreApiService } from '@features/padre/services/padre-api.service';

type ChildCard = {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly studentCode: string;
  readonly totalIncidentsCount: number;
  readonly pendingIncidentsCount: number;
};

@Component({
  selector: 'app-padre-home',
  imports: [],
  templateUrl: './padre-home.component.html',
  styleUrl: './padre-home.component.css',
})
export class PadreHomeComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly padreApiService = inject(PadreApiService);

  protected readonly children = signal<ChildCard[]>([]);

  protected readonly globalStats = computed(() => {
    const children = this.children();
    const total = children.reduce((acc, child) => acc + child.totalIncidentsCount, 0);
    const pending = children.reduce((acc, child) => acc + child.pendingIncidentsCount, 0);

    return {
      total,
      pending,
      read: total - pending,
    };
  });

  ngOnInit(): void {
    this.loadChildrenData();
  }

  private loadChildrenData(): void {
    this.padreApiService.getMyChildren().subscribe({
      next: (res) => {
        if (res.success) {
          const childrenList = res.data;

          if (childrenList.length === 0) {
            this.children.set([]);
            return;
          }

          const requests = childrenList.map((c) =>
            this.padreApiService.getIncidentsByStudent(c.id).pipe(
              map((incRes) => {
                const incidents = incRes.success ? incRes.data : [];
                return {
                  id: c.id,
                  firstName: c.firstName,
                  lastName: c.lastName,
                  studentCode: c.studentCode,
                  totalIncidentsCount: incidents.length,
                  pendingIncidentsCount: incidents.filter((i) => i.status === 'NO_LEIDA').length,
                };
              })
            )
          );

          forkJoin(requests).subscribe({
            next: (mappedChildren) => {
              this.children.set(mappedChildren);
            },
            error: (err) => console.error('Error combining children stats:', err),
          });
        }
      },
      error: (err) => console.error('Error fetching parent children:', err),
    });
  }

  protected viewReports(childId: number): void {
    void this.router.navigate(['/padre/mis-hijos'], {
      state: { selectedStudentId: childId },
    });
  }
}
