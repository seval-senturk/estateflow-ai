import { LEAD_SOURCE_LABELS } from "../constants";
import type { LeadSource } from "@prisma/client";

export function formatLeadDate(date: Date | string | null): string {
  if (!date) return "—";
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

export function getLeadFullName(firstName: string, lastName: string | null): string {
  return [firstName, lastName].filter(Boolean).join(" ");
}

export function getLeadSourceLabel(source: LeadSource): string {
  return LEAD_SOURCE_LABELS[source];
}
