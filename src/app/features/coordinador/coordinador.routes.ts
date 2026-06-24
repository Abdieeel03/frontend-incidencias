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
    path: 'estudiantes',
    loadComponent: () =>
      import('./pages/coordinador-student/coordinador-student.component').then(
        (m) => m.CoordinadorStudentComponent
      ),
  },
];
