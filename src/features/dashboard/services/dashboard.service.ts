import type { LeadSource } from "@prisma/client";

import { activeOnly, prisma } from "@/lib/database";
import { activityLogRepository } from "@/features/logs/repositories";
import { BaseService } from "@/services/base.service";
import type { ActivityLogEntry } from "@/types/logging";
import type { AnalyticsSnapshot } from "@/features/analytics/types";
import type { CrmDashboardStats } from "@/features/crm/types";

import type { DashboardStats, LatestPropertySummary } from "../types";

export interface AdminDashboardData {
  stats: DashboardStats;
  crmStats: CrmDashboardStats;
  analytics: AnalyticsSnapshot;
  recentActivities: ActivityLogEntry[];
  latestProperties: LatestPropertySummary[];
}

export class DashboardService extends BaseService {
  async getStats(): Promise<DashboardStats> {
    const snapshot = await this.getAdminDashboardData();
    return snapshot.stats;
  }

  async getAdminDashboardData(): Promise<AdminDashboardData> {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const weekAgo = new Date(now.getTime() - 7 * 86400000);

    const [
      totalProperties,
      publishedProperties,
      totalLeads,
      totalBlogPosts,
      publishedBlogPosts,
      totalUsers,
      newLeadsWeek,
      newLeadsMonth,
      wonStatus,
      lostCount,
      openLeads,
      leadsBySource,
      byStatus,
      agentPerformance,
      blogByCategory,
      recentLogins,
      recentActivities,
      latestProperties,
    ] = await Promise.all([
      prisma.property.count({ where: activeOnly }),
      prisma.property.count({ where: { ...activeOnly, isPublished: true } }),
      prisma.lead.count({ where: activeOnly }),
      prisma.blogPost.count({ where: activeOnly }),
      prisma.blogPost.count({ where: { ...activeOnly, status: "PUBLISHED" } }),
      prisma.user.count({ where: { ...activeOnly, isActive: true } }),
      prisma.lead.count({ where: { ...activeOnly, createdAt: { gte: weekAgo } } }),
      prisma.lead.count({ where: { ...activeOnly, createdAt: { gte: monthStart } } }),
      prisma.leadStatus.findFirst({ where: { slug: "kazanildi" }, select: { id: true } }),
      prisma.lead.count({
        where: { ...activeOnly, status: { slug: "kaybedildi" } },
      }),
      prisma.lead.count({
        where: {
          ...activeOnly,
          status: {
            slug: { in: ["yeni", "iletisim-kuruldu", "randevu-planlandi", "teklif-verildi", "muzakere"] },
          },
        },
      }),
      prisma.lead.groupBy({ by: ["source"], where: activeOnly, _count: { _all: true } }),
      prisma.lead.groupBy({ by: ["statusId"], where: activeOnly, _count: { _all: true } }),
      prisma.lead.groupBy({
        by: ["assignedToId"],
        where: { ...activeOnly, assignedToId: { not: null } },
        _count: { _all: true },
      }),
      prisma.blogPost.groupBy({ by: ["categoryId"], where: activeOnly, _count: { _all: true } }),
      prisma.loginHistory.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { email: true, result: true, createdAt: true },
      }),
      activityLogRepository.findRecent(8),
      prisma.property.findMany({
        where: activeOnly,
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          currency: true,
          isPublished: true,
          createdAt: true,
        },
      }),
    ]);

    const [statusMap, wonThisMonth, agents, categories] = await Promise.all([
      prisma.leadStatus.findMany({ select: { id: true, name: true, color: true } }),
      wonStatus
        ? prisma.lead.count({
            where: {
              ...activeOnly,
              statusId: wonStatus.id,
              convertedAt: { gte: monthStart },
            },
          })
        : Promise.resolve(0),
      prisma.user.findMany({
        where: { id: { in: agentPerformance.map((row) => row.assignedToId!).filter(Boolean) } },
        select: { id: true, name: true, email: true },
      }),
      prisma.blogCategory.findMany({
        where: {
          id: {
            in: blogByCategory.map((row) => row.categoryId).filter(Boolean) as string[],
          },
        },
        select: { id: true, name: true },
      }),
    ]);

    const stats: DashboardStats = {
      totalProperties,
      activeProperties: publishedProperties,
      inactiveProperties: totalProperties - publishedProperties,
      totalLeads,
      totalBlogPosts,
      totalUsers,
    };

    const crmStats: CrmDashboardStats = {
      newLeads: newLeadsWeek,
      wonThisMonth,
      pendingLeads: openLeads,
      byStatus: byStatus.map((row) => {
        const status = statusMap.find((item) => item.id === row.statusId);
        return {
          statusId: row.statusId,
          statusName: status?.name ?? "—",
          color: status?.color ?? null,
          count: row._count._all,
        };
      }),
      bySource: leadsBySource.map((row) => ({
        source: row.source as LeadSource,
        count: row._count._all,
      })),
      agentPerformance: agentPerformance.map((row) => {
        const agent = agents.find((item) => item.id === row.assignedToId);
        return {
          agentId: row.assignedToId!,
          agentName: agent?.name ?? agent?.email ?? "—",
          count: row._count._all,
        };
      }),
    };

    const analytics: AnalyticsSnapshot = {
      property: {
        total: totalProperties,
        active: publishedProperties,
        inactive: totalProperties - publishedProperties,
        published: publishedProperties,
      },
      crm: {
        total: totalLeads,
        newThisMonth: newLeadsMonth,
        open: openLeads,
        won: wonThisMonth,
        lost: lostCount,
        bySource: crmStats.bySource,
      },
      content: {
        totalPosts: totalBlogPosts,
        publishedPosts: publishedBlogPosts,
        byCategory: blogByCategory.map((row) => {
          const category = categories.find((item) => item.id === row.categoryId);
          return {
            categoryId: row.categoryId ?? "uncategorized",
            categoryName: category?.name ?? "Kategorisiz",
            count: row._count._all,
          };
        }),
      },
      system: {
        activeUsers: totalUsers,
        recentLogins,
        recentActivities: recentActivities.map((item) => ({
          description: item.description,
          action: item.action,
          createdAt: item.createdAt,
        })),
      },
    };

    return {
      stats,
      crmStats,
      analytics,
      recentActivities,
      latestProperties: latestProperties.map((property) => ({
        id: property.id,
        title: property.title,
        slug: property.slug,
        price: Number(property.price),
        currency: property.currency,
        isPublished: property.isPublished,
        createdAt: property.createdAt,
      })),
    };
  }
}

export const dashboardService = new DashboardService();
