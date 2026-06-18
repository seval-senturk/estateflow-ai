"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { EmptyState } from "@/components/admin/ui/empty-state";
import { DataTable, type DataTableColumn, Pagination, Search, Select } from "@/components/shared";
import { ACTIVITY_ACTION_LABELS, ENTITY_TYPE_LABELS } from "../constants";
import type { ActivityLogEntry, LogListResult } from "../types";

function formatLogDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

interface ActivityLogTableProps {
  result: LogListResult<ActivityLogEntry>;
  users: Array<{ id: string; name: string }>;
}

export function ActivityLogTable({ result, users }: ActivityLogTableProps) {
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

  const columns: DataTableColumn<ActivityLogEntry>[] = [
    {
      key: "createdAt",
      header: "Tarih",
      cell: (row) => formatLogDate(row.createdAt),
    },
    {
      key: "user",
      header: "Kullanıcı",
      cell: (row) => row.userName ?? row.userEmail ?? "Sistem",
    },
    {
      key: "action",
      header: "Aksiyon",
      cell: (row) => ACTIVITY_ACTION_LABELS[row.action] ?? row.action,
    },
    {
      key: "entity",
      header: "Varlık",
      cell: (row) =>
        row.entityType
          ? `${ENTITY_TYPE_LABELS[row.entityType] ?? row.entityType}${row.entityId ? ` · ${row.entityId.slice(0, 8)}` : ""}`
          : "—",
    },
    { key: "description", header: "Açıklama", cell: (row) => row.description },
    { key: "ip", header: "IP", cell: (row) => row.ipAddress ?? "—" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Search
          defaultValue={searchParams.get("search") ?? ""}
          onSearch={(value) => updateParams({ search: value || undefined })}
          placeholder="Açıklama, kullanıcı veya varlık ara…"
        />
        <div className="flex flex-wrap gap-2">
          <Select
            placeholder="Kullanıcı"
            value={searchParams.get("userId") ?? ""}
            onValueChange={(value) => updateParams({ userId: value || undefined })}
            options={[
              { value: "", label: "Tüm kullanıcılar" },
              ...users.map((user) => ({ value: user.id, label: user.name })),
            ]}
          />
          <Select
            placeholder="Aksiyon"
            value={searchParams.get("action") ?? ""}
            onValueChange={(value) => updateParams({ action: value || undefined })}
            options={[
              { value: "", label: "Tüm aksiyonlar" },
              ...Object.entries(ACTIVITY_ACTION_LABELS).map(([value, label]) => ({ value, label })),
            ]}
          />
          <Select
            placeholder="Varlık"
            value={searchParams.get("entityType") ?? ""}
            onValueChange={(value) => updateParams({ entityType: value || undefined })}
            options={[
              { value: "", label: "Tüm varlıklar" },
              ...Object.entries(ENTITY_TYPE_LABELS).map(([value, label]) => ({ value, label })),
            ]}
          />
        </div>
      </div>

      {result.items.length === 0 ? (
        <EmptyState title="Aktivite kaydı yok" description="Henüz sistem aktivitesi bulunmuyor." />
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
