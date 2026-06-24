import { Routes } from '@angular/router';

const loadCoordinadorHome = () =>
  import('@features/coordinador/pages/coordinador-dashboard/coordinador-dashboard.component').then(
    (m) => m.CoordinadorDashboardComponent
  );

const loadClases = () =>
  import('@features/coordinador/pages/clases/clases.component').then(
    (m) => m.ClasesComponent
  );

const loadProfesorHome = () =>
  import('@features/profesor/pages/profesor-home/profesor-home.component').then(
    (m) => m.ProfesorHomeComponent
  );

const loadPadreHome = () =>
  import('@features/padre/pages/padre-home/padre-home.component').then((m) => m.PadreHomeComponent);

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
        children: [
          {
            path: '',
            loadComponent: loadCoordinadorHome,
          },
          {
            path: 'usuarios',
            loadComponent: loadCoordinadorHome,
          },
          {
            path: 'incidencias',
            loadComponent: loadCoordinadorHome,
          },
          {
            path: 'clases',
            loadComponent: loadClases,
          },
          {
            path: 'estudiantes',
            loadComponent: loadCoordinadorHome,
          },
        ],
      },
      {
        path: 'profesor',
        children: [
          {
            path: '',
            loadComponent: loadProfesorHome,
          },
          {
            path: 'mis-clases',
            loadComponent: loadProfesorHome,
          },
          {
            path: 'incidencias',
            loadComponent: loadProfesorHome,
          },
        ],
      },
      {
        path: 'padre',
        children: [
          {
            path: '',
            loadComponent: loadPadreHome,
          },
          {
            path: 'mis-hijos',
            loadComponent: loadPadreHome,
          },
        ],
      },
      {
        path: 'settings',
        loadComponent: loadCoordinadorHome,
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
