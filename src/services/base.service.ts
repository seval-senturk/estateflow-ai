import {
  AppError,
  AuthenticationError,
  AuthorizationError,
  getErrorMessage,
  NotFoundError,
  ValidationError,
} from "@/lib/errors";
import type { ActionResult } from "@/types";

export abstract class BaseService {
  protected handleError<T>(error: unknown): ActionResult<T> {
    if (error instanceof ValidationError) {
      return { success: false, error: error.message, code: error.code };
    }
    if (error instanceof NotFoundError) {
      return { success: false, error: error.message, code: error.code };
    }
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message, code: error.code };
    }
    if (error instanceof AuthenticationError) {
      return { success: false, error: error.message, code: error.code };
    }
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }

    console.error("[ServiceError]", error);
    return { success: false, error: getErrorMessage(error) };
  }

  protected success<T>(data: T): ActionResult<T> {
    return { success: true, data };
  }

  protected fail<T>(error: string, code?: string): ActionResult<T> {
    return { success: false, error, code };
  }

  protected assertFound<T>(
    entity: T | null | undefined,
    resourceName: string,
  ): asserts entity is T {
    if (!entity) {
      throw new NotFoundError(resourceName);
    }
  }
}
