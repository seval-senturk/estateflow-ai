import { DataCard } from "@/components/admin/ui/data-card";
import { InfoCard } from "@/components/admin/ui/info-card";

export function SystemStatusWidget() {
  return (
    <DataCard
      title="System Status"
      description="Core platform health indicators"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <InfoCard label="Database" value="Operational" />
        <InfoCard label="Authentication" value="Operational" />
        <InfoCard label="Media Storage" value="Pending integration" />
        <InfoCard label="Background Jobs" value="Not configured" />
      </div>
    </DataCard>
  );
}
