import { Routes } from '@angular/router';

const loadProfileSettings = () =>
  import('@features/settings/pages/profile-settings/profile-settings.component').then(
    (m) => m.ProfileSettingsComponent
  );

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
        loadChildren: () =>
          import('@features/coordinador/coordinador.routes').then((m) => m.routes),
      },
      {
        path: 'profesor',
        loadChildren: () => import('@features/profesor/profesor.routes').then((m) => m.routes),
      },
      {
        path: 'padre',
        loadChildren: () => import('@features/padre/padre.routes').then((m) => m.routes),
      },
      {
        path: 'settings',
        loadComponent: loadProfileSettings,
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
