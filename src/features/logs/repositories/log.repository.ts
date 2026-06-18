import { ActivityAction, LoginResult } from "@prisma/client";
import type { Prisma } from "@prisma/client";

import { prisma, toPaginatedResult, toPrismaPagination } from "@/lib/database";
import { BaseRepository } from "@/repositories/base.repository";
import type { ActivityLogEntry } from "@/types/logging";

import type { ActivityLogFilters, LoginHistoryFilters, LogListResult } from "../types";

const activityInclude = {
  user: { select: { id: true, name: true, email: true } },
} satisfies Prisma.ActivityLogInclude;

function mapActivity(
  log: Prisma.ActivityLogGetPayload<{ include: typeof activityInclude }>,
): ActivityLogEntry {
  return {
    id: log.id,
    userId: log.userId,
    userName: log.user?.name ?? null,
    userEmail: log.user?.email ?? null,
    action: log.action,
    entityType: log.entityType,
    entityId: log.entityId,
    description: log.description,
    metadata: log.metadata as Record<string, unknown> | null,
    ipAddress: log.ipAddress,
    userAgent: log.userAgent,
    createdAt: log.createdAt,
  };
}

export class ActivityLogRepository extends BaseRepository {
  async findMany(filters: ActivityLogFilters): Promise<LogListResult<ActivityLogEntry>> {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 20;
    const { skip, take } = toPrismaPagination({ page, pageSize });

    const where: Prisma.ActivityLogWhereInput = {
      ...(filters.search
        ? {
            OR: [
              { description: { contains: filters.search, mode: "insensitive" } },
              { entityType: { contains: filters.search, mode: "insensitive" } },
              { user: { email: { contains: filters.search, mode: "insensitive" } } },
              { user: { name: { contains: filters.search, mode: "insensitive" } } },
            ],
          }
        : {}),
      ...(filters.userId ? { userId: filters.userId } : {}),
      ...(filters.action ? { action: filters.action as ActivityAction } : {}),
      ...(filters.entityType ? { entityType: filters.entityType } : {}),
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
      prisma.activityLog.findMany({
        where,
        include: activityInclude,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.activityLog.count({ where }),
    ]);

    const paginated = toPaginatedResult(items.map(mapActivity), total, { page, pageSize });
    return {
      items: paginated.data,
      total: paginated.total,
      page: paginated.page,
      pageSize: paginated.pageSize,
      totalPages: paginated.totalPages,
    };
  }

  async findRecent(limit = 10): Promise<ActivityLogEntry[]> {
    const items = await prisma.activityLog.findMany({
      include: activityInclude,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return items.map(mapActivity);
  }
}

export class LoginHistoryLogRepository extends BaseRepository {
  async findMany(filters: LoginHistoryFilters): Promise<LogListResult<import("@/types/logging").LoginHistoryEntry>> {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 20;
    const { skip, take } = toPrismaPagination({ page, pageSize });

    const where: Prisma.LoginHistoryWhereInput = {
      ...(filters.search
        ? {
            OR: [
              { email: { contains: filters.search, mode: "insensitive" } },
              { ipAddress: { contains: filters.search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(filters.userId ? { userId: filters.userId } : {}),
      ...(filters.result ? { result: filters.result as LoginResult } : {}),
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
      prisma.loginHistory.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.loginHistory.count({ where }),
    ]);

    const paginated = toPaginatedResult(
      items.map((item) => ({
        id: item.id,
        userId: item.userId,
        email: item.email,
        result: item.result,
        ipAddress: item.ipAddress,
        userAgent: item.userAgent,
        reason: item.reason,
        createdAt: item.createdAt,
      })),
      total,
      { page, pageSize },
    );
    return {
      items: paginated.data,
      total: paginated.total,
      page: paginated.page,
      pageSize: paginated.pageSize,
      totalPages: paginated.totalPages,
    };
  }

  async findRecent(limit = 5) {
    return prisma.loginHistory.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}

export const activityLogRepository = new ActivityLogRepository();
export const loginHistoryLogRepository = new LoginHistoryLogRepository();
