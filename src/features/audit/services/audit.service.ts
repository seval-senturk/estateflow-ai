import { ValidationError } from "@/lib/errors";
import { buildLogExportPayload } from "@/lib/logging";
import { BaseService } from "@/services/base.service";
import type { AsyncActionResult } from "@/types";
import type { AuditLogEntry } from "@/types/logging";

import { auditLogRepository } from "../repositories";
import { logListFiltersSchema, type LogListFiltersInput } from "@/features/logs/schemas";
import type { AuditLogFilters, LogListResult } from "@/features/logs/types";

export class AuditService extends BaseService {
  async list(filters: LogListFiltersInput): AsyncActionResult<LogListResult<AuditLogEntry>> {
    try {
      const parsed = logListFiltersSchema.safeParse(filters);
      if (!parsed.success) throw new ValidationError("Invalid audit log filters");
      const result = await auditLogRepository.findMany(parsed.data as AuditLogFilters);
      return this.success(result);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getEntityHistory(entityType: string, entityId: string): Promise<AuditLogEntry[]> {
    return auditLogRepository.findByEntity(entityType, entityId);
  }

  async exportAudit(filters: LogListFiltersInput) {
    const result = await this.list({ ...filters, page: 1, pageSize: 500 });
    if (!result.success) return result;
    const rows = result.data.items.map((item) => ({
      date: item.createdAt.toISOString(),
      user: item.userEmail ?? "—",
      action: item.action,
      entity: item.entityType,
      entityId: item.entityId,
    }));
    return this.success(buildLogExportPayload(rows, "csv", "audit-logs"));
  }
}

export const auditService = new AuditService();
