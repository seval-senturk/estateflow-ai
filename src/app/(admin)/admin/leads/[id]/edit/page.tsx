import { notFound } from "next/navigation";

import { PageHeader } from "@/components/shared";
import { permissions } from "@/config/permissions";
import { routes } from "@/config/routes";
import { LeadForm } from "@/features/crm/components";
import { crmService } from "@/features/crm/services";
import { enforcePermission } from "@/lib/authorization/guards";

interface EditLeadPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLeadPage({ params }: EditLeadPageProps) {
  await enforcePermission(permissions.leads.update);
  const { id } = await params;

  const [leadResult, lookup] = await Promise.all([crmService.getById(id), crmService.getLookupData()]);

  if (!leadResult.success || !leadResult.data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lead Düzenle"
        breadcrumbs={[
          { label: "Admin", href: routes.admin.dashboard },
          { label: "Leads", href: routes.admin.leads },
          { label: "Lead Detayı", href: routes.admin.leadDetail(id) },
          { label: "Düzenle" },
        ]}
      />
      <LeadForm mode="edit" lookup={lookup} lead={leadResult.data} />
    </div>
  );
}
