import type { CrmLookupData, LeadDetail } from "../types";
import type { LeadFormInput } from "../schemas";

export function buildLeadFormDefaults(lookup: CrmLookupData, lead?: LeadDetail): LeadFormInput {
  const defaultStatus = lookup.statuses.find((status) => status.slug === "yeni") ?? lookup.statuses[0];

  if (lead) {
    return {
      firstName: lead.firstName,
      lastName: lead.lastName ?? "",
      email: lead.email,
      phone: lead.phone ?? "",
      source: lead.source,
      statusId: lead.status.id,
      assignedToId: lead.assignedTo?.id ?? "",
      propertyId: lead.property?.id ?? "",
      budget: lead.budget ?? undefined,
      currency: (lead.currency as LeadFormInput["currency"]) ?? "TRY",
      notes: lead.notes ?? "",
    };
  }

  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    source: "MANUAL_ENTRY",
    statusId: defaultStatus?.id ?? "",
    assignedToId: "",
    propertyId: "",
    budget: undefined,
    currency: "TRY",
    notes: "",
  };
}
