export enum ErrorCode {
  APP_ERROR = "APP_ERROR",
  API_ERROR = "API_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
}

export interface ErrorDetails {
  field?: string;
  message: string;
}

export abstract class BaseError extends Error {
  abstract readonly code: ErrorCode;
  abstract readonly statusCode: number;

  constructor(
    message: string,
    public readonly details?: ErrorDetails[],
  ) {
    super(message);
    this.name = this.constructor.name;
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

export class AppError extends BaseError {
  readonly code = ErrorCode.APP_ERROR;
  readonly statusCode = 500;

  constructor(message = "An unexpected error occurred", details?: ErrorDetails[]) {
    super(message, details);
  }
}

export class ApiError extends BaseError {
  readonly code = ErrorCode.API_ERROR;
  readonly statusCode: number;

  constructor(
    message: string,
    statusCode = 500,
    details?: ErrorDetails[],
  ) {
    super(message, details);
    this.statusCode = statusCode;
  }
}

export class ValidationError extends BaseError {
  readonly code = ErrorCode.VALIDATION_ERROR;
  readonly statusCode = 400;

  constructor(message = "Validation failed", details?: ErrorDetails[]) {
    super(message, details);
  }
}

export class NotFoundError extends BaseError {
  readonly code = ErrorCode.NOT_FOUND;
  readonly statusCode = 404;

  constructor(resource = "Resource") {
    super(`${resource} not found`);
  }
}

export class AuthorizationError extends BaseError {
  readonly code = ErrorCode.FORBIDDEN;
  readonly statusCode = 403;

  constructor(message = "You do not have permission to perform this action") {
    super(message);
  }
}

export class AuthenticationError extends BaseError {
  readonly code = ErrorCode.UNAUTHORIZED;
  readonly statusCode = 401;

  constructor(message = "Authentication required") {
    super(message);
  }
}

export function isBaseError(error: unknown): error is BaseError {
  return error instanceof BaseError;
}

export function getErrorMessage(error: unknown): string {
  if (isBaseError(error)) return error.message;
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}
