export type LoginRequest = {
  username?: string;
  password?: string;
};

export type RegisterRequest = {
  name?: string;
  email?: string;
  dni?: string;
  password?: string;
};

export type ForgotPasswordRequest = {
  email?: string;
};

export type VerifyResetCodeRequest = {
  email?: string;
  code?: string;
};

export type ResetPasswordRequest = {
  email?: string;
  newPassword?: string;
  confirmPassword?: string;
};
