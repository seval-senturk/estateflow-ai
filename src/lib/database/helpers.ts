import type { PaginationParams, PaginatedResult } from "@/types";

/**
 * Prisma where-clause fragment for excluding soft-deleted records.
 */
export const activeOnly = { deletedAt: null } as const;

/**
 * Data payload for soft-deleting a record.
 */
export function softDeleteData() {
  return { deletedAt: new Date() };
}

/**
 * Data payload for restoring a soft-deleted record.
 */
export function restoreData() {
  return { deletedAt: null };
}

/**
 * Builds Prisma skip/take args from pagination params.
 */
export function toPrismaPagination(params: PaginationParams) {
  const page = Math.max(1, params.page);
  const pageSize = Math.max(1, params.pageSize);

  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
    page,
    pageSize,
  };
}

/**
 * Wraps query results into a paginated response.
 */
export function toPaginatedResult<T>(
  data: T[],
  total: number,
  params: PaginationParams,
): PaginatedResult<T> {
  const page = Math.max(1, params.page);
  const pageSize = Math.max(1, params.pageSize);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize) || 1,
  };
}

/**
 * Generates a URL-safe slug from a string.
 */
export function generateSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Audit fields for create operations.
 */
export function auditCreateFields(userId?: string) {
  return userId ? { createdById: userId, updatedById: userId } : {};
}

/**
 * Audit fields for update operations.
 */
export function auditUpdateFields(userId?: string) {
  return userId ? { updatedById: userId } : {};
}
