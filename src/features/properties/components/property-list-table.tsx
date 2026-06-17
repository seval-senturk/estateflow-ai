"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import {
  ArrowDownUp,
  Columns3,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { EmptyState } from "@/components/admin/ui/empty-state";
import { LoadingState } from "@/components/admin/ui/loading-state";
import {
  Button,
  DataTable,
  type DataTableColumn,
  Pagination,
  Search,
  Select,
} from "@/components/shared";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";

import { PropertyStatusBadge } from "./property-status-badge";
import type { PropertyListItem, PropertyListResult } from "../types";
import { formatPropertyDate, formatPropertyPriceValue } from "../utils/property-formatters";
import { deletePropertyAction } from "../actions";

interface LookupOption {
  id: string;
  name: string;
}

interface PropertyListTableProps {
  result: PropertyListResult;
  statuses: LookupOption[];
  categories: LookupOption[];
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  isLoading?: boolean;
}

type ColumnKey =
  | "title"
  | "price"
  | "city"
  | "district"
  | "category"
  | "status"
  | "published"
  | "createdAt"
  | "actions";

const COLUMN_LABELS: Record<ColumnKey, string> = {
  title: "Başlık",
  price: "Fiyat",
  city: "Şehir",
  district: "İlçe",
  category: "Kategori",
  status: "Durum",
  published: "Yayın Durumu",
  createdAt: "Oluşturulma",
  actions: "İşlemler",
};

export function PropertyListTable({
  result,
  statuses,
  categories,
  canCreate,
  canUpdate,
  canDelete,
  isLoading = false,
}: PropertyListTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showColumns, setShowColumns] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>({
    title: true,
    price: true,
    city: true,
    district: true,
    category: true,
    status: true,
    published: true,
    createdAt: true,
    actions: true,
  });

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (!value || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      if (!updates.page) {
        params.delete("page");
      }

      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const sortBy = searchParams.get("sortBy") ?? "createdAt";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";

  const toggleSort = useCallback(
    (column: string) => {
      const nextOrder =
        sortBy === column && sortOrder === "asc" ? "desc" : "asc";
      updateParams({ sortBy: column, sortOrder: nextOrder });
    },
    [sortBy, sortOrder, updateParams],
  );

  const columns = useMemo(() => {
    const allColumns: Array<DataTableColumn<PropertyListItem> & { key: ColumnKey; sortable?: boolean }> = [
      {
        key: "title",
        sortable: true,
        header: "Başlık",
        cell: (row) => (
          <div className="min-w-[200px]">
            <Link
              href={routes.admin.propertyDetail(row.id)}
              className="font-medium text-foreground hover:text-primary"
            >
              {row.title}
            </Link>
            <p className="text-xs text-muted-foreground">{row.slug}</p>
          </div>
        ),
      },
      {
        key: "price",
        sortable: true,
        header: "Fiyat",
        cell: (row) => formatPropertyPriceValue(row.price, row.currency),
      },
      {
        key: "city",
        header: "Şehir",
        cell: (row) => row.city ?? "—",
      },
      {
        key: "district",
        header: "İlçe",
        cell: (row) => row.district ?? "—",
      },
      {
        key: "category",
        header: "Kategori",
        cell: (row) => row.categoryName ?? "—",
      },
      {
        key: "status",
        header: "Durum",
        cell: (row) => (
          <PropertyStatusBadge label={row.statusName} color={row.statusColor} />
        ),
      },
      {
        key: "published",
        header: "Yayın",
        cell: (row) => (
          <span
            className={cn(
              "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
              row.isPublished
                ? "bg-emerald-500/10 text-emerald-700"
                : "bg-muted text-muted-foreground",
            )}
          >
            {row.isPublished ? "Yayında" : "Taslak"}
          </span>
        ),
      },
      {
        key: "createdAt",
        sortable: true,
        header: "Oluşturulma",
        cell: (row) => formatPropertyDate(row.createdAt),
      },
      {
        key: "actions",
        header: "İşlemler",
        cell: (row) => (
          <PropertyRowActions
            row={row}
            canUpdate={canUpdate}
            canDelete={canDelete}
            onDelete={(id, title) => {
              if (!canDelete) return;
              if (!window.confirm(`"${title}" ilanını silmek istediğinize emin misiniz?`)) {
                return;
              }
              startTransition(async () => {
                await deletePropertyAction(id);
              });
            }}
          />
        ),
      },
    ];

    return allColumns
      .filter((column) => visibleColumns[column.key])
      .map((column) => ({
        ...column,
        header: column.sortable ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="-ml-2 h-8 px-2 font-medium"
            onClick={() => toggleSort(column.key)}
          >
            {column.header}
            <ArrowDownUp className="size-3.5 opacity-60" />
          </Button>
        ) : (
          column.header
        ),
      }));
  }, [canDelete, canUpdate, visibleColumns, startTransition, toggleSort]);

  if (isLoading) {
    return <LoadingState label="İlanlar yükleniyor…" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <Search
          value={searchParams.get("search") ?? ""}
          onSearch={(value) => updateParams({ search: value || undefined })}
          placeholder="Başlık, şehir veya slug ara…"
          className="max-w-md"
        />
        <div className="flex flex-wrap items-center gap-2">
          {canCreate ? (
            <Button render={<Link href={routes.admin.propertyCreate} />}>
              Yeni İlan
            </Button>
          ) : null}
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowColumns((value) => !value)}
            >
              <Columns3 className="size-4" />
              Kolonlar
            </Button>
            {showColumns ? (
              <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-border bg-card p-2 shadow-lg">
                {(Object.keys(COLUMN_LABELS) as ColumnKey[])
                  .filter((key) => key !== "actions")
                  .map((key) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted"
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns[key]}
                        onChange={(event) =>
                          setVisibleColumns((current) => ({
                            ...current,
                            [key]: event.target.checked,
                          }))
                        }
                      />
                      {COLUMN_LABELS[key]}
                    </label>
                  ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Select
          label="Durum"
          placeholder="Tüm durumlar"
          value={searchParams.get("statusId") ?? "all"}
          onValueChange={(value) =>
            updateParams({ statusId: value === "all" ? undefined : value ?? undefined })
          }
          options={[
            { label: "Tüm durumlar", value: "all" },
            ...statuses.map((status) => ({ label: status.name, value: status.id })),
          ]}
        />
        <Select
          label="Kategori"
          placeholder="Tüm kategoriler"
          value={searchParams.get("categoryId") ?? "all"}
          onValueChange={(value) =>
            updateParams({ categoryId: value === "all" ? undefined : value ?? undefined })
          }
          options={[
            { label: "Tüm kategoriler", value: "all" },
            ...categories.map((category) => ({
              label: category.name,
              value: category.id,
            })),
          ]}
        />
        <Select
          label="Yayın Durumu"
          placeholder="Tümü"
          value={searchParams.get("isPublished") ?? "all"}
          onValueChange={(value) =>
            updateParams({
              isPublished: value === "all" ? undefined : value ?? undefined,
            })
          }
          options={[
            { label: "Tümü", value: "all" },
            { label: "Yayında", value: "published" },
            { label: "Taslak", value: "draft" },
          ]}
        />
        <div className="grid grid-cols-2 gap-2">
          <label className="space-y-1.5">
            <span className="text-sm font-medium">Başlangıç</span>
            <input
              type="date"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={searchParams.get("createdFrom") ?? ""}
              onChange={(event) =>
                updateParams({ createdFrom: event.target.value || undefined })
              }
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium">Bitiş</span>
            <input
              type="date"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={searchParams.get("createdTo") ?? ""}
              onChange={(event) =>
                updateParams({ createdTo: event.target.value || undefined })
              }
            />
          </label>
        </div>
      </div>

      {result.items.length === 0 ? (
        <EmptyState
          title="İlan bulunamadı"
          description="Arama kriterlerinizi değiştirin veya yeni bir ilan oluşturun."
          action={
            canCreate ? (
              <Button render={<Link href={routes.admin.propertyCreate} />}>
                İlk İlanı Oluştur
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={result.items}
            getRowKey={(row) => row.id}
          />
        </div>
      )}

      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        onPageChange={(page) => updateParams({ page: String(page) })}
      />

      {isPending ? (
        <p className="text-sm text-muted-foreground">İşlem yapılıyor…</p>
      ) : null}
    </div>
  );
}

function PropertyRowActions({
  row,
  canUpdate,
  canDelete,
  onDelete,
}: {
  row: PropertyListItem;
  canUpdate: boolean;
  canDelete: boolean;
  onDelete: (id: string, title: string) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        render={<Link href={routes.admin.propertyDetail(row.id)} />}
        aria-label="Görüntüle"
      >
        <Eye className="size-4" />
      </Button>
      {canUpdate ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          render={<Link href={routes.admin.propertyEdit(row.id)} />}
          aria-label="Düzenle"
        >
          <Pencil className="size-4" />
        </Button>
      ) : null}
      {canDelete ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onDelete(row.id, row.title)}
          aria-label="Sil"
        >
          <Trash2 className="size-4 text-destructive" />
        </Button>
      ) : null}
    </div>
  );
}
