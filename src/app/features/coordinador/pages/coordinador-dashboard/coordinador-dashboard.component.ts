import { Component, computed, inject, resource } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CoordinadorApiService } from '../../services/coordinador-api.service';
import { USER_ROLES } from '@core/auth/models/user-role.model';
import { AuthService } from '@core/auth/services/auth.service';
import { firstValueFrom, forkJoin } from 'rxjs';

@Component({
  selector: 'app-coordinador-dashboard',
  imports: [DatePipe],
  templateUrl: './coordinador-dashboard.component.html',
  styleUrl: './coordinador-dashboard.component.css',
})
export class CoordinadorDashboardComponent {
  private readonly apiService = inject(CoordinadorApiService);
  private readonly authService = inject(AuthService);

  protected readonly currentUser = computed(() => {
    const user = this.authService.user();
    return user ? { ...user, nombre: user.name } : null;
  });

  protected readonly dashboardResource = resource({
    loader: async () => {
      const [usersRes, studentsRes, classesRes, incidentsRes] = await firstValueFrom(
        forkJoin([
          this.apiService.getUsers(),
          this.apiService.getStudents(),
          this.apiService.getClasses(),
          this.apiService.getIncidents(),
        ])
      );

      return {
        users: usersRes.success ? usersRes.data : [],
        students: studentsRes.success ? studentsRes.data : [],
        classes: classesRes.success ? classesRes.data : [],
        incidents: incidentsRes.success ? incidentsRes.data : [],
      };
    },
  });

  protected readonly users = computed(() => this.dashboardResource.value()?.users ?? []);
  protected readonly students = computed(() => this.dashboardResource.value()?.students ?? []);
  protected readonly classes = computed(() => this.dashboardResource.value()?.classes ?? []);
  protected readonly incidents = computed(() => this.dashboardResource.value()?.incidents ?? []);

  protected readonly activeTeachers = computed(() =>
    this.users().filter((u) => u.role === USER_ROLES.PROFESOR)
  );

  protected readonly activeParents = computed(() =>
    this.users().filter((u) => u.role === USER_ROLES.PADRE)
  );

  protected readonly pendingIncidents = computed(() =>
    this.incidents().filter((i) => i.status === 'NO_LEIDA')
  );

  protected readonly resolvedIncidents = computed(() =>
    this.incidents().filter((i) => i.status === 'LEIDA')
  );

  protected readonly pendingPercentage = computed(() => {
    const total = this.incidents().length;
    return total ? Math.round((this.pendingIncidents().length / total) * 100) : 0;
  });

  protected readonly resolvedPercentage = computed(() => {
    const total = this.incidents().length;
    return total ? Math.round((this.resolvedIncidents().length / total) * 100) : 0;
  });

  protected readonly recentIncidents = computed(() => {
    return [...this.incidents()]
      .sort((a, b) => new Date(b.incidentDate).getTime() - new Date(a.incidentDate).getTime())
      .slice(0, 5);
  });
}
