import { PageHeader } from "@/components/shared";
import { DashboardWidgets } from "@/features/dashboard/components";
import { dashboardService } from "@/features/dashboard/services";
import { crmService } from "@/features/crm/services";

export default async function AdminDashboardPage() {
  const [stats, crmStats] = await Promise.all([
    dashboardService.getStats(),
    crmService.getDashboardStats(),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Operations Dashboard"
        description="Monitor listing inventory, lead flow, and team activity from a single workspace."
      />
      <DashboardWidgets stats={stats} crmStats={crmStats} />
    </div>
  );
}
