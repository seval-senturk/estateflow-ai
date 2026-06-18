import { notFound } from "next/navigation";

import { PageHeader } from "@/components/shared";
import { permissions } from "@/config/permissions";
import { routes } from "@/config/routes";
import { LeadDetailView } from "@/features/crm/components";
import { crmService } from "@/features/crm/services";
import { EntityHistoryPanel } from "@/features/audit/components";
import { auditService } from "@/features/audit/services";
import { enforcePermission } from "@/lib/authorization/guards";

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const user = await enforcePermission(permissions.leads.read);
  const { id } = await params;

  const [leadResult, lookup, auditHistory] = await Promise.all([
    crmService.getById(id),
    crmService.getLookupData(),
    auditService.getEntityHistory("LEAD", id),
  ]);

  if (!leadResult.success || !leadResult.data) {
    notFound();
  }

  const canUpdate = user.permissions.includes(permissions.leads.update);
  const canAssign = user.permissions.includes(permissions.leads.assign);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lead Detayı"
        breadcrumbs={[
          { label: "Admin", href: routes.admin.dashboard },
          { label: "Leads", href: routes.admin.leads },
          { label: "Lead Detayı" },
        ]}
      />
      <LeadDetailView
        lead={leadResult.data}
        lookup={lookup}
        canUpdate={canUpdate}
        canAssign={canAssign}
      />
      <EntityHistoryPanel title="Lead Geçmişi" entries={auditHistory} />
    </div>
  );
}
