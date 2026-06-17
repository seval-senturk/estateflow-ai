import { Building2, FileText, Users } from "lucide-react";

import { PageHeader, StatCard } from "@/components/shared";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your real estate operations"
        breadcrumbs={[{ label: "Dashboard" }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Active Listings"
          value="—"
          icon={<Building2 className="size-5" />}
        />
        <StatCard
          label="Published Articles"
          value="—"
          icon={<FileText className="size-5" />}
        />
        <StatCard
          label="Team Members"
          value="—"
          icon={<Users className="size-5" />}
        />
      </div>

      <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Business modules will be connected in upcoming phases.
        </p>
      </div>
    </div>
  );
}
