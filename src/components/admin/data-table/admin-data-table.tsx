"use client";

import { ArrowDownUp } from "lucide-react";

import {
  DataTable,
  type DataTableColumn,
  Pagination,
  Search,
} from "@/components/shared";
import { LoadingState } from "@/components/admin/ui/loading-state";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { Button } from "@/components/shared";
import { cn } from "@/lib/utils";

import { useDataTable } from "./use-data-table";

export interface AdminDataTableColumn<T> extends DataTableColumn<T> {
  sortable?: boolean;
}

export interface AdminDataTableProps<T> {
  columns: AdminDataTableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  isLoading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: Array<keyof T | ((row: T) => string)>;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
  className?: string;
}

export function AdminDataTable<T>({
  columns,
  data,
  getRowKey,
  isLoading = false,
  searchable = true,
  searchPlaceholder = "Search records…",
  searchKeys = [],
  emptyTitle = "No records found",
  emptyDescription = "Try adjusting your search or filters.",
  pageSize = 10,
  className,
}: AdminDataTableProps<T>) {
  const table = useDataTable({
    data,
    initialPageSize: pageSize,
    searchKeys,
  });

  if (isLoading) {
    return <LoadingState label="Loading table data…" className={className} />;
  }

  const enhancedColumns: DataTableColumn<T>[] = columns.map((column) => ({
    ...column,
    header: column.sortable ? (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-ml-2 h-8 px-2 font-medium"
        onClick={() => table.toggleSort(column.key)}
      >
        {column.header}
        <ArrowDownUp className="size-3.5 opacity-60" />
      </Button>
    ) : (
      column.header
    ),
  }));

  return (
    <div className={cn("space-y-4", className)}>
      {searchable ? (
        <Search
          value={table.searchQuery}
          onSearch={table.setSearchQuery}
          placeholder={searchPlaceholder}
          className="max-w-md"
        />
      ) : null}

      {table.rows.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <DataTable
          columns={enhancedColumns}
          data={table.rows}
          getRowKey={getRowKey}
        />
      )}

      <Pagination
        page={table.pagination.page}
        totalPages={table.totalPages}
        onPageChange={table.setPage}
      />
    </div>
  );
}
