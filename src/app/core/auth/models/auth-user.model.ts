import { UserRole } from './user-role.model';

export type AuthUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  imageUrl?: string;
};
