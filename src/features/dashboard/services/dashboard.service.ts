import { activeOnly, prisma } from "@/lib/database";
import { BaseService } from "@/services/base.service";

import type { DashboardStats } from "../types";

export class DashboardService extends BaseService {
  async getStats(): Promise<DashboardStats> {
    const [
      totalProperties,
      activeProperties,
      totalLeads,
      totalBlogPosts,
      totalUsers,
    ] = await Promise.all([
      prisma.property.count({ where: activeOnly }),
      prisma.property.count({
        where: { ...activeOnly, isPublished: true },
      }),
      prisma.lead.count({ where: activeOnly }),
      prisma.blogPost.count({ where: activeOnly }),
      prisma.user.count({ where: { ...activeOnly, isActive: true } }),
    ]);

    return {
      totalProperties,
      activeProperties,
      inactiveProperties: totalProperties - activeProperties,
      totalLeads,
      totalBlogPosts,
      totalUsers,
    };
  }
}

export const dashboardService = new DashboardService();
