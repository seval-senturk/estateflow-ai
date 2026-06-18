import type { ActivityLogEntry, AuditLogEntry, LoginHistoryEntry } from "@/types/logging";

export interface LogListResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ActivityLogFilters {
  search?: string;
  userId?: string;
  action?: string;
  entityType?: string;
  createdFrom?: string;
  createdTo?: string;
  page?: number;
  pageSize?: number;
}

export interface AuditLogFilters {
  search?: string;
  userId?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  createdFrom?: string;
  createdTo?: string;
  page?: number;
  pageSize?: number;
}

export interface LoginHistoryFilters {
  search?: string;
  userId?: string;
  result?: string;
  createdFrom?: string;
  createdTo?: string;
  page?: number;
  pageSize?: number;
}

export type { ActivityLogEntry, AuditLogEntry, LoginHistoryEntry };
