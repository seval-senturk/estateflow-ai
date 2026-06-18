import { activeOnly, prisma } from "@/lib/database";
import { BaseService } from "@/services/base.service";

import type { AnalyticsSnapshot } from "../types";

export class AnalyticsService extends BaseService {
  async getSnapshot(): Promise<AnalyticsSnapshot> {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalProperties,
      activeProperties,
      publishedProperties,
      totalLeads,
      newLeads,
      wonLeads,
      lostLeads,
      openLeads,
      leadsBySource,
      totalBlogPosts,
      publishedBlogPosts,
      blogByCategory,
      activeUsers,
      recentLogins,
      recentActivities,
    ] = await Promise.all([
      prisma.property.count({ where: activeOnly }),
      prisma.property.count({ where: { ...activeOnly, isPublished: true } }),
      prisma.property.count({ where: { ...activeOnly, isPublished: true } }),
      prisma.lead.count({ where: activeOnly }),
      prisma.lead.count({ where: { ...activeOnly, createdAt: { gte: monthStart } } }),
      prisma.lead.count({
        where: {
          ...activeOnly,
          status: { slug: "kazanildi" },
        },
      }),
      prisma.lead.count({
        where: {
          ...activeOnly,
          status: { slug: "kaybedildi" },
        },
      }),
      prisma.lead.count({
        where: {
          ...activeOnly,
          status: { slug: { in: ["yeni", "iletisim-kuruldu", "randevu-planlandi", "teklif-verildi", "muzakere"] } },
        },
      }),
      prisma.lead.groupBy({
        by: ["source"],
        where: activeOnly,
        _count: { _all: true },
      }),
      prisma.blogPost.count({ where: activeOnly }),
      prisma.blogPost.count({ where: { ...activeOnly, status: "PUBLISHED" } }),
      prisma.blogPost.groupBy({
        by: ["categoryId"],
        where: activeOnly,
        _count: { _all: true },
      }),
      prisma.user.count({ where: { ...activeOnly, isActive: true } }),
      prisma.loginHistory.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { email: true, result: true, createdAt: true },
      }),
      prisma.activityLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { description: true, action: true, createdAt: true },
      }),
    ]);

    const categories = await prisma.blogCategory.findMany({
      where: { id: { in: blogByCategory.map((row) => row.categoryId).filter(Boolean) as string[] } },
      select: { id: true, name: true },
    });

    return {
      property: {
        total: totalProperties,
        active: activeProperties,
        inactive: totalProperties - activeProperties,
        published: publishedProperties,
      },
      crm: {
        total: totalLeads,
        newThisMonth: newLeads,
        open: openLeads,
        won: wonLeads,
        lost: lostLeads,
        bySource: leadsBySource.map((row) => ({
          source: row.source,
          count: row._count._all,
        })),
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
        activeUsers,
        recentLogins,
        recentActivities,
      },
    };
  }
}

export const analyticsService = new AnalyticsService();
