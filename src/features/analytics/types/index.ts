import type { LeadSource } from "@prisma/client";

export interface AnalyticsSnapshot {
  property: {
    total: number;
    active: number;
    inactive: number;
    published: number;
  };
  crm: {
    total: number;
    newThisMonth: number;
    open: number;
    won: number;
    lost: number;
    bySource: Array<{ source: LeadSource; count: number }>;
  };
  content: {
    totalPosts: number;
    publishedPosts: number;
    byCategory: Array<{ categoryId: string; categoryName: string; count: number }>;
  };
  system: {
    activeUsers: number;
    recentLogins: Array<{ email: string; result: string; createdAt: Date }>;
    recentActivities: Array<{ description: string; action: string; createdAt: Date }>;
  };
}
