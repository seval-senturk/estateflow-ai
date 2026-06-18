import type { AuditAction } from "@prisma/client";
import type { Prisma } from "@prisma/client";

import { prisma, toPaginatedResult, toPrismaPagination } from "@/lib/database";
import { BaseRepository } from "@/repositories/base.repository";
import type { AuditLogEntry } from "@/types/logging";

import type { AuditLogFilters, LogListResult } from "../types";

const auditInclude = {
  user: { select: { id: true, name: true, email: true } },
} satisfies Prisma.AuditLogInclude;

function mapAudit(
  log: Prisma.AuditLogGetPayload<{ include: typeof auditInclude }>,
): AuditLogEntry {
  return {
    id: log.id,
    entityType: log.entityType,
    entityId: log.entityId,
    action: log.action,
    userId: log.userId,
    userName: log.user?.name ?? null,
    userEmail: log.user?.email ?? null,
    oldValues: log.oldValues as Record<string, unknown> | null,
    newValues: log.newValues as Record<string, unknown> | null,
    changes: log.changes as Record<string, { from: unknown; to: unknown }> | null,
    ipAddress: log.ipAddress,
    userAgent: log.userAgent,
    createdAt: log.createdAt,
  };
}

export class AuditLogRepository extends BaseRepository {
  async findMany(filters: AuditLogFilters): Promise<LogListResult<AuditLogEntry>> {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 20;
    const { skip, take } = toPrismaPagination({ page, pageSize });

    const where: Prisma.AuditLogWhereInput = {
      ...(filters.search
        ? {
            OR: [
              { entityType: { contains: filters.search, mode: "insensitive" } },
              { entityId: { contains: filters.search, mode: "insensitive" } },
              { user: { email: { contains: filters.search, mode: "insensitive" } } },
            ],
          }
        : {}),
      ...(filters.userId ? { userId: filters.userId } : {}),
      ...(filters.action ? { action: filters.action as AuditAction } : {}),
      ...(filters.entityType ? { entityType: filters.entityType } : {}),
      ...(filters.entityId ? { entityId: filters.entityId } : {}),
      ...(filters.createdFrom || filters.createdTo
        ? {
            createdAt: {
              ...(filters.createdFrom ? { gte: new Date(filters.createdFrom) } : {}),
              ...(filters.createdTo ? { lte: new Date(filters.createdTo) } : {}),
            },
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: auditInclude,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.auditLog.count({ where }),
    ]);

    const paginated = toPaginatedResult(items.map(mapAudit), total, { page, pageSize });
    return {
      items: paginated.data,
      total: paginated.total,
      page: paginated.page,
      pageSize: paginated.pageSize,
      totalPages: paginated.totalPages,
    };
  }

  async findByEntity(entityType: string, entityId: string, limit = 20): Promise<AuditLogEntry[]> {
    const items = await prisma.auditLog.findMany({
      where: { entityType, entityId },
      include: auditInclude,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return items.map(mapAudit);
  }
}

export const auditLogRepository = new AuditLogRepository();
