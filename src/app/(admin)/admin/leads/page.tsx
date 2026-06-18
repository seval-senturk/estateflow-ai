import Link from "next/link";
import { Suspense } from "react";

import { LoadingState } from "@/components/admin/ui/loading-state";
import { PageHeader, Button } from "@/components/shared";
import { permissions } from "@/config/permissions";
import { routes } from "@/config/routes";
import { LeadKanbanBoard, LeadListTable } from "@/features/crm/components";
import { buildKanbanColumns } from "@/features/crm/lib/kanban";
import { crmService } from "@/features/crm/services";
import { enforcePermission } from "@/lib/authorization/guards";

interface AdminLeadsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminLeadsPage({ searchParams }: AdminLeadsPageProps) {
  const user = await enforcePermission(permissions.leads.read);
  const params = await searchParams;

  const [listResult, lookup, kanbanData] = await Promise.all([
    crmService.list({
      search: getParam(params, "search"),
      statusId: getParam(params, "statusId"),
      assignedToId: getParam(params, "assignedToId"),
      source: getParam(params, "source") as never,
      createdFrom: getParam(params, "createdFrom"),
      createdTo: getParam(params, "createdTo"),
      page: Number(getParam(params, "page") ?? "1"),
      pageSize: Number(getParam(params, "pageSize") ?? "15"),
      sortBy: (getParam(params, "sortBy") as "createdAt" | "updatedAt" | "firstName") ?? "createdAt",
      sortOrder: (getParam(params, "sortOrder") as "asc" | "desc") ?? "desc",
    }),
    crmService.getLookupData(),
    crmService.getKanbanBoard(),
  ]);

  const canCreate = user.permissions.includes(permissions.leads.create);
  const canUpdate = user.permissions.includes(permissions.leads.update);
  const canDelete = user.permissions.includes(permissions.leads.delete);

  const result = listResult.success
    ? listResult.data
    : { items: [], total: 0, page: 1, pageSize: 15, totalPages: 0 };

  const kanbanColumns = buildKanbanColumns(kanbanData);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Lead Yönetimi"
        description="Müşteri adaylarını takip edin, danışman atayın ve dönüşüm sürecini yönetin."
        breadcrumbs={[
          { label: "Admin", href: routes.admin.dashboard },
          { label: "Leads" },
        ]}
        actions={
          canCreate ? <Button render={<Link href={routes.admin.leadCreate} />}>Yeni Lead</Button> : null
        }
      />

      <Suspense fallback={<LoadingState label="Lead listesi yükleniyor…" />}>
        <LeadListTable
          result={result}
          statuses={lookup.statuses}
          agents={lookup.agents.map((agent) => ({
            id: agent.id,
            name: agent.name ?? agent.email,
          }))}
          canCreate={canCreate}
          canUpdate={canUpdate}
          canDelete={canDelete}
        />
      </Suspense>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-medium">Kanban Görünümü</h2>
          <p className="text-sm text-muted-foreground">Lead durumlarına göre hızlı pipeline özeti.</p>
        </div>
        <LeadKanbanBoard columns={kanbanColumns} />
      </section>
    </div>
  );
}
