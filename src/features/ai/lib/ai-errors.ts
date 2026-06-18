import { AppError } from "@/lib/errors";
import type { AiErrorCode } from "../types";

export class AiError extends AppError {
  readonly aiCode: AiErrorCode;

  constructor(message: string, aiCode: AiErrorCode) {
    super(message);
    this.aiCode = aiCode;
  }
}

export function isAiError(error: unknown): error is AiError {
  return error instanceof AiError;
}
