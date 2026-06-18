"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

import { EmptyState } from "@/components/admin/ui/empty-state";
import { Button, DataTable, type DataTableColumn, Pagination, Search, Select } from "@/components/shared";
import { routes } from "@/config/routes";
import { LEAD_SOURCE_LABELS } from "../constants";
import { deleteLeadAction } from "../actions";
import type { LeadListItem, LeadListResult } from "../types";
import { formatLeadDate, getLeadFullName, getLeadSourceLabel } from "../utils/lead-formatters";
import { LeadStatusBadge } from "./lead-status-badge";

interface LookupOption {
  id: string;
  name: string;
}

interface LeadListTableProps {
  result: LeadListResult;
  statuses: LookupOption[];
  agents: LookupOption[];
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export function LeadListTable({
  result,
  statuses,
  agents,
  canCreate,
  canUpdate,
  canDelete,
}: LeadListTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (!value) params.delete(key);
        else params.set(key, value);
      });
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const columns: DataTableColumn<LeadListItem>[] = [
    {
      key: "name",
      header: "Müşteri",
      cell: (lead) => (
        <div>
          <p className="font-medium">{getLeadFullName(lead.firstName, lead.lastName)}</p>
          <p className="text-xs text-muted-foreground">{lead.email}</p>
        </div>
      ),
    },
    { key: "phone", header: "Telefon", cell: (lead) => lead.phone ?? "—" },
    { key: "source", header: "Kaynak", cell: (lead) => getLeadSourceLabel(lead.source) },
    { key: "status", header: "Durum", cell: (lead) => <LeadStatusBadge status={lead.status} /> },
    { key: "agent", header: "Danışman", cell: (lead) => lead.assignedTo?.name ?? lead.assignedTo?.email ?? "—" },
    { key: "property", header: "İlan", cell: (lead) => lead.propertyTitle ?? "—" },
    { key: "createdAt", header: "Oluşturulma", cell: (lead) => formatLeadDate(lead.createdAt) },
    {
      key: "actions",
      header: "",
      cell: (lead) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon-sm" render={<Link href={routes.admin.leadDetail(lead.id)} aria-label="Görüntüle" />}>
            <Eye className="size-4" />
          </Button>
          {canUpdate ? (
            <Button variant="ghost" size="icon-sm" render={<Link href={routes.admin.leadEdit(lead.id)} aria-label="Düzenle" />}>
              <Pencil className="size-4" />
            </Button>
          ) : null}
          {canDelete ? (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                if (!window.confirm("Bu lead'i silmek istiyor musunuz?")) return;
                startTransition(async () => {
                  await deleteLeadAction(lead.id);
                });
              }}
              aria-label="Sil"
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Search
          defaultValue={searchParams.get("search") ?? ""}
          onSearch={(value) => updateParams({ search: value || undefined })}
          placeholder="Ad, e-posta, telefon veya ilan ara…"
        />
        <div className="flex flex-wrap gap-2">
          <Select
            placeholder="Durum"
            value={searchParams.get("statusId") ?? ""}
            onValueChange={(value) => updateParams({ statusId: value || undefined })}
            options={[{ value: "", label: "Tüm durumlar" }, ...statuses.map((s) => ({ value: s.id, label: s.name }))]}
          />
          <Select
            placeholder="Danışman"
            value={searchParams.get("assignedToId") ?? ""}
            onValueChange={(value) => updateParams({ assignedToId: value || undefined })}
            options={[{ value: "", label: "Tüm danışmanlar" }, ...agents.map((a) => ({ value: a.id, label: a.name }))]}
          />
          <Select
            placeholder="Kaynak"
            value={searchParams.get("source") ?? ""}
            onValueChange={(value) => updateParams({ source: value || undefined })}
            options={[
              { value: "", label: "Tüm kaynaklar" },
              ...Object.entries(LEAD_SOURCE_LABELS).map(([value, label]) => ({ value, label })),
            ]}
          />
        </div>
      </div>

      {result.items.length === 0 ? (
        <EmptyState
          title="Lead bulunamadı"
          description="Filtreleri değiştirin veya yeni bir lead oluşturun."
          action={canCreate ? <Button render={<Link href={routes.admin.leadCreate} />}>Yeni Lead</Button> : undefined}
        />
      ) : (
        <>
          <DataTable columns={columns} data={result.items} getRowKey={(row) => row.id} />
          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            onPageChange={(page) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", String(page));
              router.push(`${pathname}?${params.toString()}`);
            }}
          />
        </>
      )}
      {isPending ? <p className="text-sm text-muted-foreground">İşlem yapılıyor…</p> : null}
    </div>
  );
}
