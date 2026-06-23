import { UserRole } from '../../../core/auth/models/user-role.model';

export type UserResponse = {
  id: number;
  username: string;
  email: string;
  name: string;
  dni: string;
  role: UserRole;
  createdById: number;
  createdByUsername?: string;
}

export type CreateUserRequest = {
  name: string;
  email: string;
  dni: string;
  password: string;
  role: UserRole;
}

// Backend UpdateUserRequest solo acepta email
export type UpdateUserRequest = {
  email: string;
}

// Para actualización por coordinador: PUT /api/users/coordinator/{id}
export type CoordinatorUpdateUserRequest = {
  dni?: string;
  role: UserRole;
}