"use server";

import { permissions } from "@/config/permissions";
import { leadRepository } from "@/features/crm/repositories/lead.repository";
import { getClientRateLimitKey } from "@/features/ai/lib/client-rate-limit";
import { requirePermission } from "@/lib/authorization/guards";
import { NotFoundError } from "@/lib/errors";

import {
  blogAssistantInputSchema,
  contentImprovementInputSchema,
  generatePropertyDescriptionSchema,
  generatePropertySummarySchema,
  leadSummaryInputSchema,
  seoAssistantInputSchema,
  smartSearchInputSchema,
} from "../schemas/ai.schema";
import { aiService } from "../services";

export async function generatePropertyDescriptionAction(
  input: unknown,
) {
  const user = await requirePermission(permissions.ai.generate);
  const parsed = generatePropertyDescriptionSchema.parse(input);
  return aiService.generatePropertyDescription(user.id, parsed);
}

export async function generatePropertySummaryAction(input: unknown) {
  const user = await requirePermission(permissions.ai.generate);
  const parsed = generatePropertySummarySchema.parse(input);
  return aiService.generatePropertySummary(user.id, parsed.description, parsed.title);
}

export async function generatePublicPropertySummaryAction(input: unknown) {
  const parsed = generatePropertySummarySchema.parse(input);
  const rateLimitKey = await getClientRateLimitKey();
  return aiService.generatePropertySummary(rateLimitKey, parsed.description, parsed.title);
}

export async function generateSeoContentAction(input: unknown) {
  const user = await requirePermission(permissions.ai.generate);
  const parsed = seoAssistantInputSchema.parse(input);
  return aiService.generateSeoContent(user.id, parsed);
}

export async function runBlogAssistantAction(input: unknown) {
  const user = await requirePermission(permissions.ai.generate);
  const parsed = blogAssistantInputSchema.parse(input);
  return aiService.runBlogAssistant(user.id, parsed);
}

export async function parseSmartSearchAction(input: unknown) {
  const user = await requirePermission(permissions.ai.generate);
  const parsed = smartSearchInputSchema.parse(input);
  return aiService.parseSmartSearch(user.id, parsed.query);
}

export async function parsePublicSmartSearchAction(input: unknown) {
  const parsed = smartSearchInputSchema.parse(input);
  const rateLimitKey = await getClientRateLimitKey();
  return aiService.parseSmartSearch(rateLimitKey, parsed.query);
}

export async function generateLeadSummaryAction(input: unknown) {
  const user = await requirePermission(permissions.ai.read);
  const parsed = leadSummaryInputSchema.parse(input);

  const lead = await leadRepository.findById(parsed.leadId);
  if (!lead) throw new NotFoundError("Lead");

  const notes = [
    lead.notes,
    ...lead.leadNotes.map((note) => note.content),
  ].filter(Boolean) as string[];

  return aiService.generateLeadSummary(user.id, {
    leadId: lead.id,
    firstName: lead.firstName,
    lastName: lead.lastName,
    source: lead.source,
    status: lead.status.name,
    budget: lead.budget ? Number(lead.budget) : null,
    propertyTitle: lead.property?.title ?? null,
    notes,
    activities: lead.activities.map((activity) => ({
      type: activity.type,
      description: activity.description ?? activity.title,
      createdAt: activity.createdAt.toISOString(),
    })),
  });
}

export async function analyzeContentAction(input: unknown) {
  const user = await requirePermission(permissions.ai.generate);
  const parsed = contentImprovementInputSchema.parse(input);
  return aiService.analyzeContent(user.id, parsed);
}

export async function getAiUsageStatsAction() {
  await requirePermission(permissions.ai.read);
  const stats = await aiService.getUsageStats();
  return { success: true as const, data: stats };
}
