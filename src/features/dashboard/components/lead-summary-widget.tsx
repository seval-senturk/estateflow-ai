import { DataCard } from "@/components/admin/ui/data-card";
import { InfoCard } from "@/components/admin/ui/info-card";

export function LeadSummaryWidget() {
  return (
    <DataCard
      title="Lead Summary"
      description="Pipeline distribution overview"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <InfoCard label="New" value="—" hint="Awaiting first contact" />
        <InfoCard label="In Progress" value="—" hint="Active follow-up" />
        <InfoCard label="Qualified" value="—" hint="Ready for conversion" />
        <InfoCard label="Won" value="—" hint="Closed successfully" />
      </div>
    </DataCard>
  );
}
