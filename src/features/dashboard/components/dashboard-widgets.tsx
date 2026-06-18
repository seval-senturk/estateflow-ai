import type { DashboardStats, LatestPropertySummary } from "../types";
import type { CrmDashboardStats } from "@/features/crm/types";
import type { AnalyticsSnapshot } from "@/features/analytics/types";
import {
  ContentAnalyticsWidget,
  CrmAnalyticsWidget,
  PropertyAnalyticsWidget,
  SystemAnalyticsWidget,
} from "@/features/analytics/components";
import { CrmAgentPerformanceWidget, CrmSourceWidget, LeadSummaryWidget } from "./crm-widgets";
import { DashboardStatsWidget } from "./dashboard-stats-widget";
import { LatestPropertiesWidget } from "./latest-properties-widget";
import { RecentActivityWidget } from "./recent-activity-widget";
import { SystemStatusWidget } from "./system-status-widget";
import type { ActivityLogEntry } from "@/types/logging";

interface DashboardWidgetsProps {
  stats: DashboardStats;
  crmStats: CrmDashboardStats;
  analytics: AnalyticsSnapshot;
  recentActivities: ActivityLogEntry[];
  latestProperties: LatestPropertySummary[];
}

export function DashboardWidgets({
  stats,
  crmStats,
  analytics,
  recentActivities,
  latestProperties,
}: DashboardWidgetsProps) {
  return (
    <div className="space-y-6">
      <DashboardStatsWidget stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        <PropertyAnalyticsWidget data={analytics.property} />
        <CrmAnalyticsWidget data={analytics.crm} />
        <ContentAnalyticsWidget data={analytics.content} />
        <SystemAnalyticsWidget data={analytics.system} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <LatestPropertiesWidget properties={latestProperties} />
        <LeadSummaryWidget stats={crmStats} />
        <CrmAgentPerformanceWidget stats={crmStats} />
        <CrmSourceWidget stats={crmStats} />
        <RecentActivityWidget activities={recentActivities} />
        <SystemStatusWidget />
      </div>
    </div>
  );
}
