"use client";

import * as React from "react";

export type SortDirection = "asc" | "desc";

export interface DataTableSortState {
  column: string;
  direction: SortDirection;
}

export interface DataTablePaginationState {
  page: number;
  pageSize: number;
}

export interface UseDataTableOptions<T> {
  data: T[];
  initialPageSize?: number;
  searchKeys?: Array<keyof T | ((row: T) => string)>;
}

export interface UseDataTableResult<T> {
  rows: T[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sort: DataTableSortState | null;
  setSort: (sort: DataTableSortState | null) => void;
  pagination: DataTablePaginationState;
  totalPages: number;
  setPage: (page: number) => void;
  toggleSort: (column: string) => void;
}

function getSearchableValue<T>(
  row: T,
  key: keyof T | ((row: T) => string),
): string {
  if (typeof key === "function") {
    return key(row).toLowerCase();
  }

  const value = row[key];
  return value == null ? "" : String(value).toLowerCase();
}

export function useDataTable<T>({
  data,
  initialPageSize = 10,
  searchKeys = [],
}: UseDataTableOptions<T>): UseDataTableResult<T> {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sort, setSort] = React.useState<DataTableSortState | null>(null);
  const [pagination, setPagination] = React.useState<DataTablePaginationState>({
    page: 1,
    pageSize: initialPageSize,
  });

  const filtered = React.useMemo(() => {
    if (!searchQuery.trim() || searchKeys.length === 0) return data;

    const query = searchQuery.trim().toLowerCase();
    return data.filter((row) =>
      searchKeys.some((key) => getSearchableValue(row, key).includes(query)),
    );
  }, [data, searchKeys, searchQuery]);

  const sorted = React.useMemo(() => {
    if (!sort) return filtered;

    const sortedRows = [...filtered];
    sortedRows.sort((a, b) => {
      const left = (a as Record<string, unknown>)[sort.column];
      const right = (b as Record<string, unknown>)[sort.column];

      if (left === right) return 0;
      if (left == null) return 1;
      if (right == null) return -1;

      const comparison = String(left).localeCompare(String(right), undefined, {
        numeric: true,
        sensitivity: "base",
      });

      return sort.direction === "asc" ? comparison : -comparison;
    });

    return sortedRows;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pagination.pageSize));

  const rows = React.useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    return sorted.slice(start, start + pagination.pageSize);
  }, [pagination.page, pagination.pageSize, sorted]);

  const setPage = React.useCallback((page: number) => {
    setPagination((current) => ({ ...current, page }));
  }, []);

  const toggleSort = React.useCallback((column: string) => {
    setSort((current) => {
      if (!current || current.column !== column) {
        return { column, direction: "asc" };
      }

      if (current.direction === "asc") {
        return { column, direction: "desc" };
      }

      return null;
    });
  }, []);

  React.useEffect(() => {
    setPagination((current) => ({ ...current, page: 1 }));
  }, [searchQuery, sort]);

  return {
    rows,
    searchQuery,
    setSearchQuery,
    sort,
    setSort,
    pagination,
    totalPages,
    setPage,
    toggleSort,
  };
}
