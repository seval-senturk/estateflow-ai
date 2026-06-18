import type { LeadActivityType, LeadSource } from "@prisma/client";

export interface LeadStatusRef {
  id: string;
  name: string;
  slug: string;
  color: string | null;
}

export interface AgentRef {
  id: string;
  name: string | null;
  email: string;
}

export interface PropertyRef {
  id: string;
  title: string;
  slug: string;
}

export interface LeadListItem {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  source: LeadSource;
  status: LeadStatusRef;
  assignedTo: AgentRef | null;
  propertyTitle: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadListResult {
  items: LeadListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LeadListFilters {
  search?: string;
  statusId?: string;
  assignedToId?: string;
  source?: LeadSource;
  createdFrom?: string;
  createdTo?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "updatedAt" | "firstName";
  sortOrder?: "asc" | "desc";
}

export interface LeadNoteItem {
  id: string;
  content: string;
  createdAt: Date;
  author: AgentRef;
}

export interface LeadActivityItem {
  id: string;
  type: LeadActivityType;
  title: string;
  description: string | null;
  createdAt: Date;
  actor: AgentRef | null;
}

export interface LeadDetail {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  source: LeadSource;
  status: LeadStatusRef;
  assignedTo: AgentRef | null;
  property: PropertyRef | null;
  budget: number | null;
  currency: string | null;
  notes: string | null;
  convertedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  leadNotes: LeadNoteItem[];
  activities: LeadActivityItem[];
}

export interface CrmLookupData {
  statuses: LeadStatusRef[];
  agents: AgentRef[];
  properties: PropertyRef[];
}

export interface CrmDashboardStats {
  newLeads: number;
  wonThisMonth: number;
  pendingLeads: number;
  byStatus: Array<{ statusId: string; statusName: string; color: string | null; count: number }>;
  bySource: Array<{ source: LeadSource; count: number }>;
  agentPerformance: Array<{ agentId: string; agentName: string; count: number }>;
}

export interface TimelineItem {
  id: string;
  kind: "note" | "activity";
  title: string;
  description: string | null;
  createdAt: Date;
  actorName: string | null;
}
