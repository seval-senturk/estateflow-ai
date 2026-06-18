import type { AiFeature, Prisma } from "@prisma/client";

import { prisma } from "@/lib/database";

import type { AiUsageLogEntry, AiUsageStats } from "../types";

export class AiUsageRepository {
  async create(entry: AiUsageLogEntry) {
    return prisma.aiUsageLog.create({
      data: {
        userId: entry.userId,
        feature: entry.feature,
        requestType: entry.requestType,
        promptVersion: entry.promptVersion,
        provider: entry.provider,
        model: entry.model,
        inputTokens: entry.inputTokens,
        outputTokens: entry.outputTokens,
        totalTokens: entry.totalTokens,
        latencyMs: entry.latencyMs,
        status: entry.status,
        errorCode: entry.errorCode,
        metadata: entry.metadata as Prisma.InputJsonValue | undefined,
      },
    });
  }

  async getStats(since?: Date): Promise<AiUsageStats> {
    const empty: AiUsageStats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalTokens: 0,
      byFeature: [],
      recentRequests: [],
    };

    try {
      const where = since ? { createdAt: { gte: since } } : {};

    const [totalRequests, successfulRequests, failedRequests, tokenAgg, byFeature, recentRequests] =
      await Promise.all([
        prisma.aiUsageLog.count({ where }),
        prisma.aiUsageLog.count({ where: { ...where, status: "SUCCESS" } }),
        prisma.aiUsageLog.count({
          where: { ...where, status: { in: ["ERROR", "RATE_LIMITED", "TIMEOUT"] } },
        }),
        prisma.aiUsageLog.aggregate({
          where: { ...where, totalTokens: { not: null } },
          _sum: { totalTokens: true },
        }),
        prisma.aiUsageLog.groupBy({
          by: ["feature"],
          where,
          _count: { _all: true },
          orderBy: { _count: { feature: "desc" } },
        }),
        prisma.aiUsageLog.findMany({
          where,
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            feature: true,
            requestType: true,
            status: true,
            createdAt: true,
          },
        }),
      ]);

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      totalTokens: tokenAgg._sum.totalTokens ?? 0,
      byFeature: byFeature.map((row) => ({
        feature: row.feature as AiFeature,
        count: row._count._all,
      })),
      recentRequests,
    };
    } catch {
      return empty;
    }
  }
}

export const aiUsageRepository = new AiUsageRepository();
