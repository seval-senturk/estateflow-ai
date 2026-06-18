/**
 * Lead export integration points (foundation only).
 */

import type { LeadListItem } from "../types";

export type LeadExportFormat = "csv" | "excel";

export interface LeadExportRequest {
  format: LeadExportFormat;
  filters?: Record<string, string | undefined>;
}

export function buildLeadExportPayload(items: LeadListItem[], format: LeadExportFormat) {
  return {
    format,
    rowCount: items.length,
    generatedAt: new Date().toISOString(),
    rows: items.map((lead) => ({
      id: lead.id,
      name: `${lead.firstName} ${lead.lastName ?? ""}`.trim(),
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
      status: lead.status.name,
      agent: lead.assignedTo?.name ?? lead.assignedTo?.email ?? "",
      property: lead.propertyTitle ?? "",
      createdAt: lead.createdAt.toISOString(),
    })),
  };
}
