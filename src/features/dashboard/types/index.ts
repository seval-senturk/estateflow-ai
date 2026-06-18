export interface DashboardStats {
  totalProperties: number;
  activeProperties: number;
  inactiveProperties: number;
  totalLeads: number;
  totalBlogPosts: number;
  totalUsers: number;
}

export interface LatestPropertySummary {
  id: string;
  title: string;
  slug: string;
  price: number;
  currency: string;
  isPublished: boolean;
  createdAt: Date;
}

export type DashboardWidgetId =
  | "stats"
  | "recent-activity"
  | "latest-properties"
  | "lead-summary"
  | "system-status";

export interface DashboardWidgetDefinition {
  id: DashboardWidgetId;
  title: string;
  description?: string;
  span?: "full" | "half" | "third";
}
