import { UserRole } from '@core/auth/models/user-role.model';

export type UserResponse = {
  id: number;
  username: string;
  email: string;
  name: string;
  dni: string;
  role: UserRole | 'ADMIN';
  createdById?: number;
  createdByUsername?: string;
};
