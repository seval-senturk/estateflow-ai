import { PageHeader } from "@/components/shared";
import { DashboardWidgets } from "@/features/dashboard/components";
import { dashboardService } from "@/features/dashboard/services";

export default async function AdminDashboardPage() {
  const stats = await dashboardService.getStats();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Operations Dashboard"
        description="Monitor listing inventory, lead flow, and team activity from a single workspace."
      />
      <DashboardWidgets stats={stats} />
    </div>
  );
}
