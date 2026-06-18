import { ValidationError } from "@/lib/errors";
import { buildLogExportPayload } from "@/lib/logging";
import { BaseService } from "@/services/base.service";
import type { AsyncActionResult } from "@/types";
import type { ActivityLogEntry, LoginHistoryEntry } from "@/types/logging";

import { activityLogRepository, loginHistoryLogRepository } from "../repositories";
import { logListFiltersSchema } from "../schemas";
import type { LogListFiltersInput } from "../schemas";
import type { ActivityLogFilters, LogListResult, LoginHistoryFilters } from "../types";

export class LogsService extends BaseService {
  async listActivity(filters: LogListFiltersInput): AsyncActionResult<LogListResult<ActivityLogEntry>> {
    try {
      const parsed = logListFiltersSchema.safeParse(filters);
      if (!parsed.success) throw new ValidationError("Invalid activity log filters");
      const result = await activityLogRepository.findMany(parsed.data as ActivityLogFilters);
      return this.success(result);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async listLoginHistory(filters: LogListFiltersInput): AsyncActionResult<LogListResult<LoginHistoryEntry>> {
    try {
      const parsed = logListFiltersSchema.safeParse(filters);
      if (!parsed.success) throw new ValidationError("Invalid login history filters");
      const result = await loginHistoryLogRepository.findMany(parsed.data as LoginHistoryFilters);
      return this.success(result);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getRecentActivity(limit = 10): Promise<ActivityLogEntry[]> {
    return activityLogRepository.findRecent(limit);
  }

  async exportActivity(filters: LogListFiltersInput) {
    const result = await this.listActivity({ ...filters, page: 1, pageSize: 500 });
    if (!result.success) return result;
    const rows = result.data.items.map((item) => ({
      date: item.createdAt.toISOString(),
      user: item.userEmail ?? "—",
      action: item.action,
      entity: item.entityType ?? "—",
      description: item.description,
      ip: item.ipAddress ?? "—",
    }));
    return this.success(buildLogExportPayload(rows, "csv", "activity-logs"));
  }
}

export const logsService = new LogsService();
