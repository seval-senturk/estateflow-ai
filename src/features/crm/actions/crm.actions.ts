"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { routes } from "@/config/routes";
import { permissions } from "@/config/permissions";
import { requireAuth, requirePermission } from "@/lib/authorization/guards";

import { crmService } from "../services";
import type {
  ContactRequestInput,
  LeadFormInput,
  LeadListFiltersInput,
  LeadNoteInput,
  PropertyInquiryInput,
} from "../schemas";

export async function createLeadAction(input: LeadFormInput) {
  const user = await requirePermission(permissions.leads.create);
  const result = await crmService.create(input, user.id);
  if (!result.success) return result;
  revalidatePath(routes.admin.leads);
  redirect(routes.admin.leadDetail(result.data.id));
}

export async function updateLeadAction(id: string, input: LeadFormInput) {
  const user = await requirePermission(permissions.leads.update);
  const result = await crmService.update(id, input, user.id);
  if (!result.success) return result;
  revalidatePath(routes.admin.leads);
  revalidatePath(routes.admin.leadDetail(id));
  redirect(routes.admin.leadDetail(id));
}

export async function deleteLeadAction(id: string) {
  await requirePermission(permissions.leads.delete);
  const result = await crmService.delete(id);
  if (!result.success) return result;
  revalidatePath(routes.admin.leads);
  redirect(routes.admin.leads);
}

export async function updateLeadStatusAction(id: string, statusId: string) {
  const user = await requirePermission(permissions.leads.update);
  const result = await crmService.updateStatus(id, statusId, user.id);
  if (!result.success) return result;
  revalidatePath(routes.admin.leadDetail(id));
  revalidatePath(routes.admin.leads);
  return result;
}

export async function assignLeadAgentAction(id: string, assignedToId: string | null) {
  const user = await requirePermission(permissions.leads.assign);
  const result = await crmService.assignAgent(id, assignedToId, user.id);
  if (!result.success) return result;
  revalidatePath(routes.admin.leadDetail(id));
  revalidatePath(routes.admin.leads);
  return result;
}

export async function addLeadNoteAction(id: string, input: LeadNoteInput) {
  const user = await requirePermission(permissions.leads.update);
  const result = await crmService.addNote(id, input, user.id);
  if (!result.success) return result;
  revalidatePath(routes.admin.leadDetail(id));
  return result;
}

export async function submitContactRequestAction(input: ContactRequestInput) {
  return crmService.submitContactRequest(input);
}

export async function submitPropertyInquiryAction(input: PropertyInquiryInput) {
  return crmService.submitPropertyInquiry(input);
}

export async function listLeadsAction(filters: LeadListFiltersInput) {
  await requirePermission(permissions.leads.read);
  return crmService.list(filters);
}

export async function exportLeadsAction(filters: LeadListFiltersInput) {
  await requirePermission(permissions.leads.export);
  const user = await requireAuth();
  void user;
  const result = await crmService.list(filters);
  if (!result.success) return result;
  const { buildLeadExportPayload } = await import("../lib/export");
  return { success: true as const, data: buildLeadExportPayload(result.data.items, "csv") };
}
