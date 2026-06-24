import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { USER_ROLES } from '@core/auth/models/user-role.model';
import { RoleLabelPipe } from '@shared/pipes/role-label.pipe';

type SidebarItem = {
  readonly label: string;
  readonly icon: string;
  readonly path: string;
};

type DashboardSection = 'coordinador' | 'profesor' | 'padre';

const TITLE_MAP: Record<DashboardSection, string> = {
  coordinador: 'Coordinador Panel',
  profesor: 'Profesor Panel',
  padre: 'Padre Panel',
};

const SECTION_NAVIGATION: Record<DashboardSection, readonly SidebarItem[]> = {
  coordinador: [
    { label: 'Dashboard', icon: 'dashboard', path: '/coordinador' },
    { label: 'Profesores y Padres', icon: 'manage_accounts', path: '/coordinador/usuarios' },
    { label: 'Incidencias', icon: 'report_problem', path: '/coordinador/incidencias' },
    { label: 'Clases', icon: 'meeting_room', path: '/coordinador/clases' },
    { label: 'Estudiantes', icon: 'school', path: '/coordinador/estudiantes' },
  ],
  profesor: [
    { label: 'Dashboard', icon: 'dashboard', path: '/profesor' },
    { label: 'Mis clases', icon: 'local_library', path: '/profesor/aulas' },
    { label: 'Incidencias', icon: 'report_problem', path: '/profesor/incidencias' },
  ],
  padre: [
    { label: 'Dashboard', icon: 'dashboard', path: '/padre' },
    { label: 'Mis Hijos', icon: 'family_restroom', path: '/padre/mis-hijos' },
  ],
};

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, RoleLabelPipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private readonly router = inject(Router);

  readonly isOpen = input(false);
  readonly navigate = output<void>();

  protected readonly isLogoutModalOpen = signal(false);
  protected readonly section = computed(() => this.getSectionFromUrl());
  protected readonly settingsPath = '/settings';
  protected readonly navigationItems = computed(() => SECTION_NAVIGATION[this.section()]);
  protected readonly title = computed(() => TITLE_MAP[this.section()]);
  protected readonly mockUser = {
    name: 'Usuario Demo',
    role: USER_ROLES.COORDINADOR,
    initials: 'U',
  };

  protected onNavigate(): void {
    this.navigate.emit();
  }

  protected openLogoutModal(): void {
    this.isLogoutModalOpen.set(true);
  }

  protected closeLogoutModal(): void {
    this.isLogoutModalOpen.set(false);
  }

  protected confirmLogout(): void {
    this.isLogoutModalOpen.set(false);
  }

  private getSectionFromUrl(): DashboardSection {
    const url = this.router.url;

    if (url.startsWith('/profesor')) {
      return 'profesor';
    }

    if (url.startsWith('/padre')) {
      return 'padre';
    }

    return 'coordinador';
  }
}
