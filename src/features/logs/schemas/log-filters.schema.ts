import { ActivityAction, AuditAction, LoginResult } from "@prisma/client";
import { z } from "zod";

export const logListFiltersSchema = z.object({
  search: z.string().optional(),
  userId: z.string().optional(),
  action: z.nativeEnum(ActivityAction).optional(),
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  result: z.nativeEnum(LoginResult).optional(),
  createdFrom: z.string().optional(),
  createdTo: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type LogListFiltersInput = z.infer<typeof logListFiltersSchema>;

export { ActivityAction, AuditAction, LoginResult };
