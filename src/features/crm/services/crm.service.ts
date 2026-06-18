import { loggableEntities, snapshotRecord, trackActivity, trackAudit } from "@/lib/logging";
import { trackCrmNotification } from "../lib/notifications";
import { leadRepository } from "../repositories";
import {
  contactRequestSchema,
  leadAssignSchema,
  leadFormSchema,
  leadListFiltersSchema,
  leadNoteSchema,
  leadStatusUpdateSchema,
  propertyInquirySchema,
  splitFullName,
} from "../schemas";
import type {
  ContactRequestInput,
  LeadFormInput,
  LeadListFiltersInput,
  LeadNoteInput,
  PropertyInquiryInput,
} from "../schemas";
import type { LeadDetail, LeadListResult } from "../types";
import { ValidationError } from "@/lib/errors";
import { BaseService } from "@/services/base.service";
import type { AsyncActionResult } from "@/types";

export class CrmService extends BaseService {
  async list(filters: LeadListFiltersInput): AsyncActionResult<LeadListResult> {
    try {
      const parsed = leadListFiltersSchema.safeParse(filters);
      if (!parsed.success) throw new ValidationError("Invalid lead list filters");
      const result = await leadRepository.findMany(parsed.data);
      return this.success(result);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getById(id: string): AsyncActionResult<LeadDetail> {
    try {
      const lead = await leadRepository.findById(id);
      this.assertFound(lead, "Lead");
      return this.success(lead);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getLookupData() {
    return leadRepository.getLookupData();
  }

  async getDashboardStats() {
    return leadRepository.getDashboardStats();
  }

  async create(input: LeadFormInput, userId: string): AsyncActionResult<{ id: string }> {
    try {
      const parsed = leadFormSchema.parse(input);
      const lead = await leadRepository.create(parsed, userId);
      await leadRepository.logActivity(lead.id, userId, "LEAD_CREATED", "Lead oluşturuldu");
      await trackActivity({
        userId,
        action: "CREATE",
        entityType: loggableEntities.LEAD,
        entityId: lead.id,
        description: `Lead oluşturuldu: ${parsed.firstName} ${parsed.lastName ?? ""}`.trim(),
      });
      await trackAudit({
        userId,
        action: "CREATE",
        entityType: loggableEntities.LEAD,
        entityId: lead.id,
        newValues: snapshotRecord(parsed as unknown as Record<string, unknown>, [
          "firstName",
          "lastName",
          "email",
          "source",
          "statusId",
        ]),
      });
      trackCrmNotification({ type: "NEW_LEAD", leadId: lead.id });
      return this.success({ id: lead.id });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async update(id: string, input: LeadFormInput, userId: string): AsyncActionResult<{ id: string }> {
    try {
      const parsed = leadFormSchema.parse(input);
      const before = await leadRepository.findById(id);
      this.assertFound(before, "Lead");
      const lead = await leadRepository.update(id, parsed);
      await leadRepository.logActivity(id, userId, "LEAD_UPDATED", "Lead güncellendi");
      await trackActivity({
        userId,
        action: "UPDATE",
        entityType: loggableEntities.LEAD,
        entityId: id,
        description: `Lead güncellendi: ${parsed.firstName}`,
      });
      await trackAudit({
        userId,
        action: "UPDATE",
        entityType: loggableEntities.LEAD,
        entityId: id,
        oldValues: {
          firstName: before.firstName,
          email: before.email,
          statusId: before.status.id,
        },
        newValues: snapshotRecord(parsed as unknown as Record<string, unknown>, [
          "firstName",
          "email",
          "statusId",
        ]),
      });
      return this.success({ id: lead.id });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateStatus(id: string, statusId: string, userId: string) {
    try {
      const parsed = leadStatusUpdateSchema.parse({ statusId });
      const before = await leadRepository.findById(id);
      this.assertFound(before, "Lead");
      const lead = await leadRepository.updateStatus(id, parsed.statusId);
      await leadRepository.logActivity(
        id,
        userId,
        "STATUS_CHANGED",
        "Durum değiştirildi",
        `${before.status.name} → ${lead.status.name}`,
        { fromStatusId: before.status.id, toStatusId: parsed.statusId },
      );
      trackCrmNotification({ type: "STATUS_CHANGED", leadId: id, statusId: parsed.statusId });
      return this.success({ id: lead.id });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async assignAgent(id: string, assignedToId: string | null, userId: string) {
    try {
      const parsed = leadAssignSchema.parse({ assignedToId });
      const lead = await leadRepository.assignAgent(id, parsed.assignedToId);
      const type = parsed.assignedToId ? "AGENT_ASSIGNED" : "AGENT_UNASSIGNED";
      const title = parsed.assignedToId ? "Danışman atandı" : "Danışman ataması kaldırıldı";
      await leadRepository.logActivity(id, userId, type, title);
      await trackActivity({
        userId,
        action: "UPDATE",
        entityType: loggableEntities.LEAD,
        entityId: id,
        description: title,
        metadata: { assignedToId: parsed.assignedToId },
      });
      if (parsed.assignedToId) {
        trackCrmNotification({ type: "ASSIGNMENT", leadId: id, agentId: parsed.assignedToId });
      }
      return this.success({ id: lead.id });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async addNote(id: string, input: LeadNoteInput, userId: string) {
    try {
      const parsed = leadNoteSchema.parse(input);
      await leadRepository.addNote(id, userId, parsed.content);
      await leadRepository.logActivity(id, userId, "NOTE_ADDED", "Not eklendi", parsed.content);
      return this.success({ id });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(id: string, userId?: string) {
    try {
      const existing = await leadRepository.findById(id);
      if (existing) {
        await trackActivity({
          userId,
          action: "DELETE",
          entityType: loggableEntities.LEAD,
          entityId: id,
          description: `Lead silindi: ${existing.firstName}`,
        });
      }
      await leadRepository.softDelete(id);
      return this.success(undefined);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async submitContactRequest(input: ContactRequestInput) {
    try {
      const parsed = contactRequestSchema.parse(input);
      const { firstName, lastName } = splitFullName(parsed.name);
      const defaultStatusId = await leadRepository.getDefaultStatusId();

      let propertyId = parsed.propertyId;
      if (!propertyId && parsed.propertyTitle) {
        const property = await prismaFindPropertyByTitle(parsed.propertyTitle);
        propertyId = property?.id;
      }

      const lead = await leadRepository.create(
        {
          firstName,
          lastName,
          email: parsed.email,
          phone: parsed.phone,
          source: "CONTACT_FORM",
          statusId: defaultStatusId,
          propertyId,
          notes: parsed.message,
        },
        null,
      );

      await leadRepository.createContactRequest({
        ...parsed,
        leadId: lead.id,
      });

      await leadRepository.logActivity(lead.id, null, "LEAD_CREATED", "İletişim formundan lead oluşturuldu");
      trackCrmNotification({ type: "NEW_LEAD", leadId: lead.id });

      return this.success({ id: lead.id });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async submitPropertyInquiry(input: PropertyInquiryInput) {
    try {
      const parsed = propertyInquirySchema.parse(input);
      const { firstName, lastName } = splitFullName(parsed.name);
      const defaultStatusId = await leadRepository.getDefaultStatusId();

      const lead = await leadRepository.create(
        {
          firstName,
          lastName,
          email: parsed.email,
          phone: parsed.phone,
          source: "PROPERTY_INQUIRY",
          statusId: defaultStatusId,
          propertyId: parsed.propertyId,
          notes: parsed.message,
        },
        null,
      );

      await leadRepository.createPropertyInquiry({ ...parsed, leadId: lead.id });
      await leadRepository.logActivity(lead.id, null, "LEAD_CREATED", "İlan talebinden lead oluşturuldu");
      if (parsed.propertyId) {
        await leadRepository.logActivity(lead.id, null, "PROPERTY_LINKED", "İlan ile ilişkilendirildi");
      }
      trackCrmNotification({ type: "NEW_LEAD", leadId: lead.id });

      return this.success({ id: lead.id });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getKanbanBoard() {
    const { KANBAN_STATUS_SLUGS } = await import("../constants");
    const columns = await Promise.all(
      KANBAN_STATUS_SLUGS.map(async (slug) => ({
        slug,
        items: await leadRepository.findByKanbanColumn(slug),
      })),
    );
    return columns;
  }
}

async function prismaFindPropertyByTitle(title: string) {
  const { prisma, activeOnly } = await import("@/lib/database");
  return prisma.property.findFirst({
    where: { title: { equals: title, mode: "insensitive" }, ...activeOnly },
    select: { id: true },
  });
}

export const crmService = new CrmService();
