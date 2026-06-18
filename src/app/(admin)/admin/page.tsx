import { PageHeader } from "@/components/shared";
import { DashboardWidgets } from "@/features/dashboard/components";
import { dashboardService } from "@/features/dashboard/services";
import { crmService } from "@/features/crm/services";
import { analyticsService } from "@/features/analytics/services";
import { logsService } from "@/features/logs/services";

export default async function AdminDashboardPage() {
  const [stats, crmStats, analytics, recentActivities] = await Promise.all([
    dashboardService.getStats(),
    crmService.getDashboardStats(),
    analyticsService.getSnapshot(),
    logsService.getRecentActivity(8),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Operations Dashboard"
        description="Monitor listing inventory, lead flow, and team activity from a single workspace."
      />
      <DashboardWidgets
        stats={stats}
        crmStats={crmStats}
        analytics={analytics}
        recentActivities={recentActivities}
      />
    </div>
  );
}
