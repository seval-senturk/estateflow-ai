export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  ACCOUNT_DISABLED: "ACCOUNT_DISABLED",
  VALIDATION_ERROR: "VALIDATION_ERROR",
} as const;

export type AuthErrorCode =
  (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

export const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  [AUTH_ERROR_CODES.INVALID_CREDENTIALS]:
    "Invalid email or password. Please try again.",
  [AUTH_ERROR_CODES.UNAUTHORIZED]:
    "You must be signed in to access this resource.",
  [AUTH_ERROR_CODES.FORBIDDEN]:
    "You do not have permission to access this area.",
  [AUTH_ERROR_CODES.SESSION_EXPIRED]:
    "Your session has expired. Please sign in again.",
  [AUTH_ERROR_CODES.ACCOUNT_DISABLED]:
    "This account has been disabled. Contact your administrator.",
  [AUTH_ERROR_CODES.VALIDATION_ERROR]:
    "Please check the form and try again.",
};
