import type { ActivityAction, AuditAction } from "@prisma/client";

export const logActionTypes = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  VIEW: "VIEW",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  PUBLISH: "PUBLISH",
  UNPUBLISH: "UNPUBLISH",
  UPLOAD: "UPLOAD",
  EXPORT: "EXPORT",
  RESTORE: "RESTORE",
} as const;

export type LogActionType =
  (typeof logActionTypes)[keyof typeof logActionTypes];

export const loggableEntities = {
  PROPERTY: "PROPERTY",
  BLOG_POST: "BLOG_POST",
  LEAD: "LEAD",
  MEDIA: "MEDIA",
  USER: "USER",
  CONTACT: "CONTACT",
  FAVORITE: "FAVORITE",
  SETTINGS: "SETTINGS",
  SESSION: "SESSION",
  SECURITY: "SECURITY",
} as const;

export type LoggableEntity =
  (typeof loggableEntities)[keyof typeof loggableEntities];

export interface AuditLogEntry {
  id: string;
  entityType: LoggableEntity | string;
  entityId: string;
  action: AuditAction;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  changes?: Record<string, { from: unknown; to: unknown }> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
}

export interface ActivityLogEntry {
  id: string;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  action: ActivityAction;
  entityType?: LoggableEntity | string | null;
  entityId?: string | null;
  description: string;
  metadata?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
}

export interface LoginHistoryEntry {
  id: string;
  userId: string | null;
  email: string;
  result: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  reason?: string | null;
  createdAt: Date;
}

export interface LogContext {
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
}
