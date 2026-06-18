"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { EmptyState } from "@/components/admin/ui/empty-state";
import { DataTable, type DataTableColumn, Pagination, Search, Select } from "@/components/shared";
import { AUDIT_ACTION_LABELS } from "@/features/audit/constants";
import { ENTITY_TYPE_LABELS } from "../constants";
import type { AuditLogEntry } from "@/types/logging";
import type { LogListResult } from "../types";

function formatLogDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

interface AuditLogTableProps {
  result: LogListResult<AuditLogEntry>;
  users: Array<{ id: string; name: string }>;
}

export function AuditLogTable({ result, users }: AuditLogTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  const columns: DataTableColumn<AuditLogEntry>[] = [
    { key: "createdAt", header: "Tarih", cell: (row) => formatLogDate(row.createdAt) },
    { key: "user", header: "Kullanıcı", cell: (row) => row.userName ?? row.userEmail ?? "Sistem" },
    { key: "action", header: "Aksiyon", cell: (row) => AUDIT_ACTION_LABELS[row.action] ?? row.action },
    {
      key: "entity",
      header: "Varlık",
      cell: (row) => `${ENTITY_TYPE_LABELS[row.entityType] ?? row.entityType} · ${row.entityId.slice(0, 8)}`,
    },
    {
      key: "changes",
      header: "Değişiklikler",
      cell: (row) => {
        const count = row.changes ? Object.keys(row.changes).length : 0;
        return count > 0 ? `${count} alan` : "—";
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Search
          defaultValue={searchParams.get("search") ?? ""}
          onSearch={(value) => updateParams({ search: value || undefined })}
          placeholder="Varlık veya kullanıcı ara…"
        />
        <Select
          placeholder="Kullanıcı"
          value={searchParams.get("userId") ?? ""}
          onValueChange={(value) => updateParams({ userId: value || undefined })}
          options={[
            { value: "", label: "Tüm kullanıcılar" },
            ...users.map((user) => ({ value: user.id, label: user.name })),
          ]}
        />
      </div>

      {result.items.length === 0 ? (
        <EmptyState title="Audit kaydı yok" description="Henüz denetim izi bulunmuyor." />
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
    </div>
  );
}
