import { DataCard } from "@/components/admin/ui/data-card";
import { EmptyState } from "@/components/admin/ui/empty-state";

export function RecentActivityWidget() {
  return (
    <DataCard
      title="Recent Activity"
      description="Workspace events and audit entries"
    >
      <EmptyState
        title="Activity feed not connected"
        description="Audit and activity streams will be displayed here in a later phase."
      />
    </DataCard>
  );
}
