import type { AiFeature, AiRequestStatus } from "@prisma/client";

export type { AiFeature, AiRequestStatus };

export type AiProviderName = "openai" | "azure-openai";

export type AiErrorCode =
  | "AI_NOT_CONFIGURED"
  | "AI_RATE_LIMIT"
  | "AI_TIMEOUT"
  | "AI_PROVIDER_ERROR"
  | "AI_INVALID_RESPONSE"
  | "AI_TOKEN_LIMIT"
  | "AI_DISABLED";

export interface AiCompletionRequest {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
  temperature?: number;
  jsonMode?: boolean;
}

export interface AiCompletionResult {
  content: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  latencyMs: number;
}

export interface AiUsageLogEntry {
  userId: string | null;
  feature: AiFeature;
  requestType: string;
  promptVersion: string;
  provider: string;
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  latencyMs?: number;
  status: AiRequestStatus;
  errorCode?: string;
  metadata?: Record<string, unknown>;
}

export interface AiUsageStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalTokens: number;
  byFeature: Array<{ feature: AiFeature; count: number }>;
  recentRequests: Array<{
    id: string;
    feature: AiFeature;
    requestType: string;
    status: AiRequestStatus;
    createdAt: Date;
  }>;
}

export interface PropertyDescriptionContext {
  title?: string;
  roomCount?: string;
  grossArea?: number;
  netArea?: number;
  city?: string;
  district?: string;
  neighborhood?: string;
  listingType?: string;
  propertyKind?: string;
  heatingType?: string;
  features?: string[];
  price?: number;
  currency?: string;
}

export interface SeoAssistantContext {
  entityType: "property" | "blog";
  title: string;
  excerpt?: string;
  content?: string;
  city?: string;
  district?: string;
}

export interface BlogAssistantContext {
  title?: string;
  excerpt?: string;
  content?: string;
  categories?: Array<{ id: string; name: string }>;
}

export interface ContentImprovementContext {
  entityType: "property" | "blog";
  title: string;
  shortDescription?: string;
  description?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface LeadSummaryContext {
  leadId: string;
  firstName: string;
  lastName?: string | null;
  source: string;
  status: string;
  budget?: number | null;
  propertyTitle?: string | null;
  notes: string[];
  activities: Array<{ type: string; description: string; createdAt: string }>;
}

export interface SmartSearchParseResult {
  search?: string;
  city?: string;
  district?: string;
  neighborhood?: string;
  listingType?: string;
  propertyKind?: string;
  roomCount?: string;
  features?: string[];
  interpretation: string;
}

export interface SeoAssistantResult {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogTitle: string;
  ogDescription: string;
}

export interface BlogAssistantResult {
  titles?: string[];
  metaDescription?: string;
  seoDescription?: string;
  contentDraft?: string;
  suggestedCategoryId?: string;
  suggestedCategoryName?: string;
}

export interface ContentImprovementResult {
  score: number;
  missingFields: string[];
  seoSuggestions: string[];
  qualitySuggestions: string[];
}
