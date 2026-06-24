import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/padre-home/padre-home.component').then((m) => m.PadreHomeComponent),
  },
  {
    path: 'mis-hijos',
    loadComponent: () =>
      import('./pages/padre-children-incidents/padre-children-incidents.component').then(
        (m) => m.PadreChildrenIncidentsComponent
      ),
  },
];
