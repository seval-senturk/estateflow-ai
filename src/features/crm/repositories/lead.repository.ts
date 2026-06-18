import type { LeadActivityType, LeadSource, Prisma } from "@prisma/client";

import {
  activeOnly,
  prisma,
  softDeleteData,
  toPaginatedResult,
  toPrismaPagination,
} from "@/lib/database";
import { BaseRepository } from "@/repositories/base.repository";

import type {
  AgentRef,
  CrmDashboardStats,
  CrmLookupData,
  LeadActivityItem,
  LeadDetail,
  LeadListFilters,
  LeadListItem,
  LeadListResult,
  LeadNoteItem,
  LeadStatusRef,
} from "../types";
import type { LeadFormInput } from "../schemas";

const leadListInclude = {
  status: true,
  assignedTo: { select: { id: true, name: true, email: true } },
  property: { select: { id: true, title: true, slug: true } },
} satisfies Prisma.LeadInclude;

const leadDetailInclude = {
  status: true,
  assignedTo: { select: { id: true, name: true, email: true } },
  property: { select: { id: true, title: true, slug: true } },
  leadNotes: {
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" as const },
    take: 50,
  },
  activities: {
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" as const },
    take: 50,
  },
} satisfies Prisma.LeadInclude;

function mapAgent(
  user: { id: string; name: string | null; email: string } | null,
): AgentRef | null {
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email };
}

function mapStatus(status: { id: string; name: string; slug: string; color: string | null }): LeadStatusRef {
  return { id: status.id, name: status.name, slug: status.slug, color: status.color };
}

function mapListItem(
  lead: Prisma.LeadGetPayload<{ include: typeof leadListInclude }>,
): LeadListItem {
  return {
    id: lead.id,
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    source: lead.source,
    status: mapStatus(lead.status),
    assignedTo: mapAgent(lead.assignedTo),
    propertyTitle: lead.property?.title ?? null,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  };
}

function mapNote(
  note: Prisma.LeadNoteGetPayload<{ include: { user: { select: { id: true; name: true; email: true } } } }>,
): LeadNoteItem {
  return {
    id: note.id,
    content: note.content,
    createdAt: note.createdAt,
    author: mapAgent(note.user)!,
  };
}

function mapActivity(
  activity: Prisma.LeadActivityGetPayload<{
    include: { user: { select: { id: true; name: true; email: true } } };
  }>,
): LeadActivityItem {
  return {
    id: activity.id,
    type: activity.type,
    title: activity.title,
    description: activity.description,
    createdAt: activity.createdAt,
    actor: mapAgent(activity.user),
  };
}

function mapDetail(
  lead: Prisma.LeadGetPayload<{ include: typeof leadDetailInclude }>,
): LeadDetail {
  return {
    id: lead.id,
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    source: lead.source,
    status: mapStatus(lead.status),
    assignedTo: mapAgent(lead.assignedTo),
    property: lead.property
      ? { id: lead.property.id, title: lead.property.title, slug: lead.property.slug }
      : null,
    budget: lead.budget != null ? Number(lead.budget) : null,
    currency: lead.currency,
    notes: lead.notes,
    convertedAt: lead.convertedAt,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
    leadNotes: lead.leadNotes.map(mapNote),
    activities: lead.activities.map(mapActivity),
  };
}

export class LeadRepository extends BaseRepository {
  async findMany(filters: LeadListFilters): Promise<LeadListResult> {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 15;
    const { skip, take } = toPrismaPagination({ page, pageSize });

    const where: Prisma.LeadWhereInput = {
      ...activeOnly,
      ...(filters.search
        ? {
            OR: [
              { firstName: { contains: filters.search, mode: "insensitive" } },
              { lastName: { contains: filters.search, mode: "insensitive" } },
              { email: { contains: filters.search, mode: "insensitive" } },
              { phone: { contains: filters.search, mode: "insensitive" } },
              { property: { title: { contains: filters.search, mode: "insensitive" } } },
            ],
          }
        : {}),
      ...(filters.statusId ? { statusId: filters.statusId } : {}),
      ...(filters.assignedToId ? { assignedToId: filters.assignedToId } : {}),
      ...(filters.source ? { source: filters.source } : {}),
      ...(filters.createdFrom || filters.createdTo
        ? {
            createdAt: {
              ...(filters.createdFrom ? { gte: new Date(filters.createdFrom) } : {}),
              ...(filters.createdTo ? { lte: new Date(`${filters.createdTo}T23:59:59`) } : {}),
            },
          }
        : {}),
    };

    const orderBy: Prisma.LeadOrderByWithRelationInput = {
      [filters.sortBy ?? "createdAt"]: filters.sortOrder ?? "desc",
    };

    const [items, total] = await Promise.all([
      prisma.lead.findMany({ where, include: leadListInclude, orderBy, skip, take }),
      prisma.lead.count({ where }),
    ]);

    const paginated = toPaginatedResult(items.map(mapListItem), total, { page, pageSize });
    return {
      items: paginated.data,
      total: paginated.total,
      page: paginated.page,
      pageSize: paginated.pageSize,
      totalPages: paginated.totalPages,
    };
  }

  async findById(id: string): Promise<LeadDetail | null> {
    const lead = await prisma.lead.findFirst({
      where: { id, ...activeOnly },
      include: leadDetailInclude,
    });
    return lead ? mapDetail(lead) : null;
  }

  async getDefaultStatusId(): Promise<string> {
    const status = await prisma.leadStatus.findFirst({
      where: { isDefault: true, isActive: true },
      select: { id: true },
    });
    if (!status) {
      const fallback = await prisma.leadStatus.findFirst({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: { id: true },
      });
      if (!fallback) throw new Error("No lead status configured");
      return fallback.id;
    }
    return status.id;
  }

  async getStatusBySlug(slug: string) {
    return prisma.leadStatus.findFirst({ where: { slug, isActive: true }, select: { id: true, name: true, slug: true } });
  }

  async create(input: LeadFormInput, userId?: string | null) {
    return prisma.lead.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName || null,
        email: input.email,
        phone: input.phone || null,
        source: input.source,
        statusId: input.statusId,
        assignedToId: input.assignedToId || null,
        propertyId: input.propertyId || null,
        budget: input.budget,
        currency: input.currency,
        notes: input.notes || null,
        createdById: userId ?? null,
      },
      include: leadDetailInclude,
    });
  }

  async update(id: string, input: LeadFormInput) {
    return prisma.lead.update({
      where: { id },
      data: {
        firstName: input.firstName,
        lastName: input.lastName || null,
        email: input.email,
        phone: input.phone || null,
        source: input.source,
        statusId: input.statusId,
        assignedToId: input.assignedToId || null,
        propertyId: input.propertyId || null,
        budget: input.budget,
        currency: input.currency,
        notes: input.notes || null,
      },
      include: leadDetailInclude,
    });
  }

  async updateStatus(id: string, statusId: string) {
    const status = await prisma.leadStatus.findUnique({ where: { id: statusId } });
    const convertedAt = status?.slug === "kazanildi" ? new Date() : null;
    return prisma.lead.update({
      where: { id },
      data: { statusId, convertedAt },
      include: leadDetailInclude,
    });
  }

  async assignAgent(id: string, assignedToId: string | null) {
    return prisma.lead.update({
      where: { id },
      data: { assignedToId },
      include: leadDetailInclude,
    });
  }

  async softDelete(id: string) {
    return prisma.lead.update({ where: { id }, data: softDeleteData() });
  }

  async addNote(leadId: string, userId: string, content: string) {
    return prisma.leadNote.create({
      data: { leadId, userId, content },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  async logActivity(
    leadId: string,
    userId: string | null,
    type: LeadActivityType,
    title: string,
    description?: string,
    metadata?: Prisma.InputJsonValue,
  ) {
    return prisma.leadActivity.create({
      data: { leadId, userId, type, title, description, metadata },
    });
  }

  async getLookupData(): Promise<CrmLookupData> {
    const [statuses, agents, properties] = await Promise.all([
      prisma.leadStatus.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true, slug: true, color: true },
      }),
      prisma.user.findMany({
        where: { ...activeOnly, isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true, email: true },
      }),
      prisma.property.findMany({
        where: { ...activeOnly, isPublished: true },
        orderBy: { title: "asc" },
        take: 100,
        select: { id: true, title: true, slug: true },
      }),
    ]);

    return { statuses, agents, properties };
  }

  async getDashboardStats(): Promise<CrmDashboardStats> {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [newLeads, wonStatus, pendingStatuses, byStatus, bySource, agentPerformance] =
      await Promise.all([
        prisma.lead.count({
          where: { ...activeOnly, createdAt: { gte: new Date(now.getTime() - 7 * 86400000) } },
        }),
        prisma.leadStatus.findFirst({ where: { slug: "kazanildi" }, select: { id: true } }),
        prisma.leadStatus.findMany({
          where: { slug: { in: ["yeni", "iletisim-kuruldu", "randevu-planlandi", "teklif-verildi", "muzakere"] } },
          select: { id: true },
        }),
        prisma.lead.groupBy({
          by: ["statusId"],
          where: activeOnly,
          _count: { _all: true },
        }),
        prisma.lead.groupBy({
          by: ["source"],
          where: activeOnly,
          _count: { _all: true },
        }),
        prisma.lead.groupBy({
          by: ["assignedToId"],
          where: { ...activeOnly, assignedToId: { not: null } },
          _count: { _all: true },
        }),
      ]);

    const statusMap = await prisma.leadStatus.findMany({
      select: { id: true, name: true, color: true },
    });

    const wonThisMonth = wonStatus
      ? await prisma.lead.count({
          where: {
            ...activeOnly,
            statusId: wonStatus.id,
            convertedAt: { gte: monthStart },
          },
        })
      : 0;

    const pendingLeads = pendingStatuses.length
      ? await prisma.lead.count({
          where: { ...activeOnly, statusId: { in: pendingStatuses.map((s) => s.id) } },
        })
      : 0;

    const agents = await prisma.user.findMany({
      where: { id: { in: agentPerformance.map((a) => a.assignedToId!).filter(Boolean) } },
      select: { id: true, name: true, email: true },
    });

    return {
      newLeads,
      wonThisMonth,
      pendingLeads,
      byStatus: byStatus.map((row) => {
        const status = statusMap.find((item) => item.id === row.statusId);
        return {
          statusId: row.statusId,
          statusName: status?.name ?? "—",
          color: status?.color ?? null,
          count: row._count._all,
        };
      }),
      bySource: bySource.map((row) => ({ source: row.source as LeadSource, count: row._count._all })),
      agentPerformance: agentPerformance.map((row) => {
        const agent = agents.find((item) => item.id === row.assignedToId);
        return {
          agentId: row.assignedToId!,
          agentName: agent?.name ?? agent?.email ?? "—",
          count: row._count._all,
        };
      }),
    };
  }

  async findByKanbanColumn(statusSlug: string, limit = 20) {
    const status = await prisma.leadStatus.findFirst({ where: { slug: statusSlug, isActive: true } });
    if (!status) return [];

    const items = await prisma.lead.findMany({
      where: { ...activeOnly, statusId: status.id },
      include: leadListInclude,
      orderBy: { updatedAt: "desc" },
      take: limit,
    });

    return items.map(mapListItem);
  }

  async createContactRequest(data: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    leadId?: string;
  }) {
    return prisma.contactRequest.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        leadId: data.leadId,
        source: "CONTACT_FORM",
      },
    });
  }

  async createPropertyInquiry(data: {
    propertyId: string;
    name: string;
    email: string;
    phone?: string;
    message?: string;
    leadId?: string;
  }) {
    return prisma.propertyInquiry.create({
      data: {
        propertyId: data.propertyId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        leadId: data.leadId,
        source: "PROPERTY_INQUIRY",
      },
    });
  }

  async findPropertyIdBySlug(slug: string) {
    const property = await prisma.property.findFirst({
      where: { slug, isPublished: true, ...activeOnly },
      select: { id: true, title: true },
    });
    return property;
  }
}

export const leadRepository = new LeadRepository();
