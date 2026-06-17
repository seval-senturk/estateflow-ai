import { DataCard } from "@/components/admin/ui/data-card";
import { EmptyState } from "@/components/admin/ui/empty-state";

export function LatestPropertiesWidget() {
  return (
    <DataCard
      title="Latest Properties"
      description="Recently added listings will appear here"
    >
      <EmptyState
        title="No listings yet"
        description="Property records will surface in this panel once listing management is enabled."
      />
    </DataCard>
  );
}
