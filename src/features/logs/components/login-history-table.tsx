"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { EmptyState } from "@/components/admin/ui/empty-state";
import { DataTable, type DataTableColumn, Pagination, Search, Select } from "@/components/shared";
import type { LoginHistoryEntry, LogListResult } from "../types";

const LOGIN_RESULT_LABELS: Record<string, string> = {
  SUCCESS: "Başarılı",
  FAILURE: "Başarısız",
  LOCKED: "Kilitli",
  MFA_REQUIRED: "MFA Gerekli",
};

function formatLogDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

interface LoginHistoryTableProps {
  result: LogListResult<LoginHistoryEntry>;
}

export function LoginHistoryTable({ result }: LoginHistoryTableProps) {
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

  const columns: DataTableColumn<LoginHistoryEntry>[] = [
    { key: "createdAt", header: "Tarih", cell: (row) => formatLogDate(row.createdAt) },
    { key: "email", header: "E-posta", cell: (row) => row.email },
    {
      key: "result",
      header: "Sonuç",
      cell: (row) => LOGIN_RESULT_LABELS[row.result] ?? row.result,
    },
    { key: "ip", header: "IP", cell: (row) => row.ipAddress ?? "—" },
    {
      key: "agent",
      header: "Tarayıcı",
      cell: (row) => (row.userAgent ? row.userAgent.slice(0, 40) + "…" : "—"),
    },
    { key: "reason", header: "Neden", cell: (row) => row.reason ?? "—" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Search
          defaultValue={searchParams.get("search") ?? ""}
          onSearch={(value) => updateParams({ search: value || undefined })}
          placeholder="E-posta veya IP ara…"
        />
        <Select
          placeholder="Sonuç"
          value={searchParams.get("result") ?? ""}
          onValueChange={(value) => updateParams({ result: value || undefined })}
          options={[
            { value: "", label: "Tüm sonuçlar" },
            ...Object.entries(LOGIN_RESULT_LABELS).map(([value, label]) => ({ value, label })),
          ]}
        />
      </div>

      {result.items.length === 0 ? (
        <EmptyState title="Giriş kaydı yok" description="Henüz giriş geçmişi bulunmuyor." />
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
