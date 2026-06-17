import { PASSWORD_HASH_ROUNDS } from "@/lib/password";

export { PASSWORD_HASH_ROUNDS };

export const PASSWORD_RULES = {
  minLength: 8,
  maxLength: 128,
} as const;

export const PASSWORD_VALIDATION_MESSAGES = {
  minLength: `Password must be at least ${PASSWORD_RULES.minLength} characters`,
  maxLength: `Password must be at most ${PASSWORD_RULES.maxLength} characters`,
  required: "Password is required",
} as const;
