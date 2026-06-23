import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@layouts/auth-layout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('@features/auth/pages/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('@features/auth/pages/register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('@layouts/dashboard-layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent
      ),
    children: [
      {
        path: 'coordinador',
        loadComponent: () =>
          import('@features/coordinador/pages/coordinador-home/coordinador-home.component').then(
            (m) => m.CoordinadorHomeComponent
          ),
      },
      {
        path: 'profesor',
        loadComponent: () =>
          import('@features/profesor/pages/profesor-home/profesor-home.component').then(
            (m) => m.ProfesorHomeComponent
          ),
      },
      {
        path: 'padre',
        loadComponent: () =>
          import('@features/padre/pages/padre-home/padre-home.component').then(
            (m) => m.PadreHomeComponent
          ),
      },
    ],
  },
  {
    path: '403',
    loadComponent: () =>
      import('@app/features/forbidden/forbidden.component').then((m) => m.ForbiddenComponent),
  },
  {
    path: '404',
    loadComponent: () =>
      import('@app/features/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
