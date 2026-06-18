import type { DashboardStats } from "../types";
import type { CrmDashboardStats } from "@/features/crm/types";
import { CrmAgentPerformanceWidget, CrmSourceWidget, LeadSummaryWidget } from "./crm-widgets";
import { DashboardStatsWidget } from "./dashboard-stats-widget";
import { LatestPropertiesWidget } from "./latest-properties-widget";
import { RecentActivityWidget } from "./recent-activity-widget";
import { SystemStatusWidget } from "./system-status-widget";

interface DashboardWidgetsProps {
  stats: DashboardStats;
  crmStats: CrmDashboardStats;
}

export function DashboardWidgets({ stats, crmStats }: DashboardWidgetsProps) {
  return (
    <div className="space-y-6">
      <DashboardStatsWidget stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <LatestPropertiesWidget />
        <LeadSummaryWidget stats={crmStats} />
        <CrmAgentPerformanceWidget stats={crmStats} />
        <CrmSourceWidget stats={crmStats} />
        <RecentActivityWidget />
        <SystemStatusWidget />
      </div>
    </div>
  );
}
