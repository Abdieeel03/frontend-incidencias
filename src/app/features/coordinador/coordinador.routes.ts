import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/coordinador-dashboard/coordinador-dashboard.component').then(
        (m) => m.CoordinadorDashboardComponent
      ),
  },
  {
    path: 'usuarios',
    loadComponent: () =>
      import('./pages/coordinador-user/coordinador-user.component').then(
        (m) => m.CoordinadorUserComponent
      ),
  },
  {
    path: 'clases',
    loadComponent: () =>
      import('./pages/coordinador-class/coordinador-class.component').then(
        (m) => m.CoordinadorClassComponent
      ),
  },
  {
    path: 'estudiantes',
    loadComponent: () =>
      import('./pages/coordinador-student/coordinador-student.component').then(
        (m) => m.CoordinadorStudentComponent
      ),
  },
  {
    path: 'incidencias',
    loadComponent: () =>
      import('./pages/coordinador-incident/coordinador-incident.component').then(
        (m) => m.CoordinadorIncidentComponent
      ),
  },
];
