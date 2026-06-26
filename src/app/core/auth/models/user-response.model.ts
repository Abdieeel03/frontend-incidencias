import { UserRole } from './user-role.model';

export type UserResponse = {
  id: number;
  username: string;
  email: string;
  name: string;
  dni: string;
  role: UserRole;
  createdById: number;
  createdByUsername?: string;
  imageUrl?: string;
};

export type CreateUserRequest = {
  name: string;
  email: string;
  dni: string;
  password: string;
  role: UserRole;
};

export type UpdateUserRequest = {
  email: string;
  imageUrl?: string;
};

export type CoordinatorUpdateUserRequest = {
  dni?: string;
  role: UserRole;
};
