import { PageHeader } from "@/components/shared";
import { permissions } from "@/config/permissions";
import { routes } from "@/config/routes";
import { LeadForm } from "@/features/crm/components";
import { crmService } from "@/features/crm/services";
import { enforcePermission } from "@/lib/authorization/guards";

export default async function CreateLeadPage() {
  await enforcePermission(permissions.leads.create);
  const lookup = await crmService.getLookupData();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Yeni Lead"
        breadcrumbs={[
          { label: "Admin", href: routes.admin.dashboard },
          { label: "Leads", href: routes.admin.leads },
          { label: "Yeni Lead" },
        ]}
      />
      <LeadForm mode="create" lookup={lookup} />
    </div>
  );
}
