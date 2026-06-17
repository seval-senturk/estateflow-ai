import type { DashboardStats } from "../types";
import { DashboardStatsWidget } from "./dashboard-stats-widget";
import { LatestPropertiesWidget } from "./latest-properties-widget";
import { LeadSummaryWidget } from "./lead-summary-widget";
import { RecentActivityWidget } from "./recent-activity-widget";
import { SystemStatusWidget } from "./system-status-widget";

interface DashboardWidgetsProps {
  stats: DashboardStats;
}

export function DashboardWidgets({ stats }: DashboardWidgetsProps) {
  return (
    <div className="space-y-6">
      <DashboardStatsWidget stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <LatestPropertiesWidget />
        <LeadSummaryWidget />
        <RecentActivityWidget />
        <SystemStatusWidget />
      </div>
    </div>
  );
}
