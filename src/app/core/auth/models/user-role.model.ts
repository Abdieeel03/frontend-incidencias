export const USER_ROLES = {
  COORDINADOR: 'COORDINADOR',
  PROFESOR: 'PROFESOR',
  PADRE: 'PADRE',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
