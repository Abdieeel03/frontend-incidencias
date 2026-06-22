import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'aulas',
    loadComponent: () =>
      import('./pages/aulas/aulas.component').then((m) => m.AulasComponent),
  },
  {
    path: 'incidencias',
    loadComponent: () =>
      import('./pages/incidencias/incidencias.component').then((m) => m.IncidenciasComponent),
  },
  {
    path: 'incidencias/crear',
    loadComponent: () =>
      import('./pages/incidencia-form/incidencia-form.component').then(
        (m) => m.IncidenciaFormComponent
      ),
  },
  {
    path: 'incidencias/editar/:id',
    loadComponent: () =>
      import('./pages/incidencia-form/incidencia-form.component').then(
        (m) => m.IncidenciaFormComponent
      ),
  },
];