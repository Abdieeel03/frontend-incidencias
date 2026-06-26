import { UserRole } from './user-role.model';

export type AuthResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  userId: number;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  imageUrl?: string;
};
