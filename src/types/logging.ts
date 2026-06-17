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
} as const;

export type LogActionType =
  (typeof logActionTypes)[keyof typeof logActionTypes];

export const loggableEntities = {
  PROPERTY: "PROPERTY",
  BLOG_POST: "BLOG_POST",
  MEDIA: "MEDIA",
  USER: "USER",
  CONTACT: "CONTACT",
  FAVORITE: "FAVORITE",
  SETTINGS: "SETTINGS",
  SESSION: "SESSION",
} as const;

export type LoggableEntity =
  (typeof loggableEntities)[keyof typeof loggableEntities];

export interface AuditLogEntry {
  id: string;
  entity: LoggableEntity;
  entityId: string;
  action: LogActionType;
  userId: string;
  userEmail: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface ActivityLogEntry {
  id: string;
  userId: string;
  action: LogActionType;
  description: string;
  resourceType?: LoggableEntity;
  resourceId?: string;
  createdAt: Date;
}

export interface LogContext {
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
}
