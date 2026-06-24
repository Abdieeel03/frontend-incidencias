import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'aulas',
    loadComponent: () => import('./pages/aulas/aulas.component').then((m) => m.AulasComponent),
  },
  {
    path: 'incidencias',
    loadComponent: () =>
      import('./pages/incidencias/incidencias.component').then((m) => m.IncidenciasComponent),
  },
];
