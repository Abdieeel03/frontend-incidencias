import { AuthUser } from './auth-user.model';

export type AuthSession = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
};
