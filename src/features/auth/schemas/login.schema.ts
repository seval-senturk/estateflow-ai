import { z } from "zod";

import {
  PASSWORD_RULES,
  PASSWORD_VALIDATION_MESSAGES,
} from "../constants";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(PASSWORD_RULES.minLength, PASSWORD_VALIDATION_MESSAGES.minLength)
    .max(PASSWORD_RULES.maxLength, PASSWORD_VALIDATION_MESSAGES.maxLength),
});

export type LoginInput = z.infer<typeof loginSchema>;
