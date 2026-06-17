export interface DashboardStats {
  totalProperties: number;
  activeProperties: number;
  inactiveProperties: number;
  totalLeads: number;
  totalBlogPosts: number;
  totalUsers: number;
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
