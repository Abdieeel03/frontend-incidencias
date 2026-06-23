import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

type ChildCard = {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly studentCode: string;
  readonly totalIncidentsCount: number;
  readonly pendingIncidentsCount: number;
};

const MOCK_CHILDREN: readonly ChildCard[] = [
  {
    id: 1,
    firstName: 'Valentina',
    lastName: 'Ramirez',
    studentCode: 'EST-2026-014',
    totalIncidentsCount: 3,
    pendingIncidentsCount: 1,
  },
  {
    id: 2,
    firstName: 'Mateo',
    lastName: 'Ramirez',
    studentCode: 'EST-2026-029',
    totalIncidentsCount: 1,
    pendingIncidentsCount: 0,
  },
];

@Component({
  selector: 'app-padre-home',
  imports: [],
  templateUrl: './padre-home.component.html',
  styleUrl: './padre-home.component.css',
})
export class PadreHomeComponent {
  private readonly router = inject(Router);

  protected readonly children = signal(MOCK_CHILDREN);

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

  protected viewReports(childId: number): void {
    void this.router.navigate(['/padre/mis-hijos'], {
      state: { selectedStudentId: childId },
    });
  }
}
