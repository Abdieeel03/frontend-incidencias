import { Pipe, PipeTransform } from '@angular/core';

import { USER_ROLES, UserRole } from '@core/auth/models/user-role.model';

const ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLES.COORDINADOR]: 'Coordinador',
  [USER_ROLES.PROFESOR]: 'Profesor',
  [USER_ROLES.PADRE]: 'Padre',
};

@Pipe({
  name: 'roleLabel',
})
export class RoleLabelPipe implements PipeTransform {
  transform(role: UserRole | string | null | undefined): string {
    if (role === undefined || role === null || role === '') {
      return '';
    }

    return this.isUserRole(role) ? ROLE_LABELS[role] : role;
  }

  private isUserRole(role: string): role is UserRole {
    return Object.values(USER_ROLES).includes(role as UserRole);
  }
}
