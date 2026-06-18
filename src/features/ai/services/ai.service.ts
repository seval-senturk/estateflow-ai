import type { AiFeature, AiRequestStatus } from "@prisma/client";

import { getAiConfig, isAiEnabled } from "@/config/ai";
import { ValidationError } from "@/lib/errors";
import { emitObservabilityEvent } from "@/lib/logging/observability";
import { BaseService } from "@/services/base.service";
import type { ActionResult } from "@/types";

import { AI_REQUEST_TYPES } from "../constants";
import { AiError, isAiError } from "../lib/ai-errors";
import {
  blogCategorySuggestionPrompt,
  blogContentDraftPrompt,
  blogMetaDescriptionPrompt,
  blogTitleSuggestionsPrompt,
  contentImprovementPrompt,
  leadSummaryPrompt,
  propertyDescriptionPrompt,
  propertySummaryPrompt,
  seoAssistantPrompt,
  smartSearchPrompt,
} from "../prompts";
import { getCachedPropertySummary, getCachedSmartSearchParse } from "@/lib/cache/ai-responses";

import { getAiProvider } from "../providers";
import { aiUsageRepository } from "../repositories/ai-usage.repository";
import type {
  BlogAssistantContext,
  BlogAssistantResult,
  ContentImprovementContext,
  ContentImprovementResult,
  LeadSummaryContext,
  PropertyDescriptionContext,
  SeoAssistantContext,
  SeoAssistantResult,
  SmartSearchParseResult,
} from "../types";
import { assertTokenBudget, checkPublicRateLimit, checkRateLimit } from "./token-manager";

function parseJsonResponse<T>(content: string): T {
  const trimmed = content.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  const payload = jsonMatch ? jsonMatch[0] : trimmed;

  try {
    return JSON.parse(payload) as T;
  } catch {
    throw new AiError("AI yanıtı geçerli JSON formatında değil.", "AI_INVALID_RESPONSE");
  }
}

export class AiService extends BaseService {
  private async executeCompletion<T>(options: {
    userId: string;
    feature: AiFeature;
    requestType: string;
    promptVersion: string;
    systemPrompt: string;
    userPrompt: string;
    jsonMode?: boolean;
    maxTokens?: number;
    parse: (content: string) => T;
  }): Promise<ActionResult<T>> {
    const {
      userId,
      feature,
      requestType,
      promptVersion,
      systemPrompt,
      userPrompt,
      jsonMode,
      maxTokens,
      parse,
    } = options;

    const config = getAiConfig();
    const provider = getAiProvider();
    let status: AiRequestStatus = "ERROR";
    let errorCode: string | undefined;

    try {
      if (!isAiEnabled()) {
        throw new AiError("AI özellikleri devre dışı.", "AI_DISABLED");
      }
      if (!provider.isConfigured()) {
        throw new AiError("AI sağlayıcısı yapılandırılmamış.", "AI_NOT_CONFIGURED");
      }

      if (userId.startsWith("ip:")) {
        checkPublicRateLimit(userId);
      } else {
        checkRateLimit(userId);
      }
      assertTokenBudget(systemPrompt, userPrompt, maxTokens ?? config.defaultMaxTokens);

      const result = await provider.complete({
        systemPrompt,
        userPrompt,
        jsonMode,
        maxTokens,
      });

      const parsed = parse(result.content);
      status = "SUCCESS";

      await aiUsageRepository.create({
        userId,
        feature,
        requestType,
        promptVersion,
        provider: provider.name,
        model: result.model,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        totalTokens: result.totalTokens,
        latencyMs: result.latencyMs,
        status,
      });

      emitObservabilityEvent({
        type: "activity",
        action: requestType,
        userId,
        metadata: { ai: true, feature, tokens: result.totalTokens },
      });

      return this.success(parsed);
    } catch (error) {
      if (error instanceof AiError) {
        errorCode = error.aiCode;
        status =
          error.aiCode === "AI_RATE_LIMIT"
            ? "RATE_LIMITED"
            : error.aiCode === "AI_TIMEOUT"
              ? "TIMEOUT"
              : "ERROR";
      }

      await aiUsageRepository
        .create({
          userId,
          feature,
          requestType,
          promptVersion,
          provider: provider.name,
          status,
          errorCode,
          metadata: { message: error instanceof Error ? error.message : "Unknown error" },
        })
        .catch(() => undefined);

      if (isAiError(error)) {
        return this.fail(error.message, error.aiCode);
      }
      return this.handleError<T>(error);
    }
  }

  async generatePropertyDescription(
    userId: string,
    context: PropertyDescriptionContext,
  ): Promise<ActionResult<{ description: string }>> {
    return this.executeCompletion({
      userId,
      feature: "PROPERTY_DESCRIPTION",
      requestType: AI_REQUEST_TYPES.GENERATE_DESCRIPTION,
      promptVersion: propertyDescriptionPrompt.version,
      systemPrompt: propertyDescriptionPrompt.system,
      userPrompt: propertyDescriptionPrompt.buildUser(context),
      maxTokens: 1200,
      parse: (content) => ({ description: content }),
    });
  }

  async generatePropertySummary(
    userId: string,
    description: string,
    title?: string,
    options?: { useCache?: boolean },
  ): Promise<ActionResult<{ summary: string }>> {
    const run = () =>
      this.executeCompletion({
        userId,
        feature: "PROPERTY_SUMMARY",
        requestType: AI_REQUEST_TYPES.GENERATE_SUMMARY,
        promptVersion: propertySummaryPrompt.version,
        systemPrompt: propertySummaryPrompt.system,
        userPrompt: propertySummaryPrompt.buildUser(description, title),
        maxTokens: 300,
        parse: (content) => ({ summary: content }),
      });

    if (options?.useCache === false) {
      return run();
    }

    return getCachedPropertySummary(description, title, run);
  }

  async generateSeoContent(
    userId: string,
    context: SeoAssistantContext,
  ): Promise<ActionResult<SeoAssistantResult>> {
    return this.executeCompletion({
      userId,
      feature: "SEO_ASSISTANT",
      requestType: AI_REQUEST_TYPES.SEO_GENERATE,
      promptVersion: seoAssistantPrompt.version,
      systemPrompt: seoAssistantPrompt.system,
      userPrompt: seoAssistantPrompt.buildUser(context),
      jsonMode: true,
      maxTokens: 600,
      parse: (content) => parseJsonResponse<SeoAssistantResult>(content),
    });
  }

  async runBlogAssistant(
    userId: string,
    mode: BlogAssistantContext & { mode: "titles" | "meta" | "draft" | "category" },
  ): Promise<ActionResult<BlogAssistantResult>> {
    switch (mode.mode) {
      case "titles": {
        const result = await this.executeCompletion({
          userId,
          feature: "BLOG_ASSISTANT",
          requestType: AI_REQUEST_TYPES.BLOG_TITLES,
          promptVersion: blogTitleSuggestionsPrompt.version,
          systemPrompt: blogTitleSuggestionsPrompt.system,
          userPrompt: blogTitleSuggestionsPrompt.buildUser(mode),
          jsonMode: true,
          maxTokens: 800,
          parse: (content) => parseJsonResponse<{ titles: string[] }>(content),
        });
        if (!result.success) return result;
        return this.success({ titles: result.data.titles });
      }
      case "meta": {
        const result = await this.executeCompletion({
          userId,
          feature: "BLOG_ASSISTANT",
          requestType: AI_REQUEST_TYPES.BLOG_META,
          promptVersion: blogMetaDescriptionPrompt.version,
          systemPrompt: blogMetaDescriptionPrompt.system,
          userPrompt: blogMetaDescriptionPrompt.buildUser(mode),
          maxTokens: 300,
          parse: (content) => content,
        });
        if (!result.success) return result;
        return this.success({
          metaDescription: result.data,
          seoDescription: result.data,
        });
      }
      case "draft": {
        const result = await this.executeCompletion({
          userId,
          feature: "BLOG_ASSISTANT",
          requestType: AI_REQUEST_TYPES.BLOG_DRAFT,
          promptVersion: blogContentDraftPrompt.version,
          systemPrompt: blogContentDraftPrompt.system,
          userPrompt: blogContentDraftPrompt.buildUser(mode),
          maxTokens: 2000,
          parse: (content) => content,
        });
        if (!result.success) return result;
        return this.success({ contentDraft: result.data });
      }
      case "category": {
        const result = await this.executeCompletion({
          userId,
          feature: "BLOG_ASSISTANT",
          requestType: AI_REQUEST_TYPES.BLOG_CATEGORY,
          promptVersion: blogCategorySuggestionPrompt.version,
          systemPrompt: blogCategorySuggestionPrompt.system,
          userPrompt: blogCategorySuggestionPrompt.buildUser(mode),
          jsonMode: true,
          maxTokens: 300,
          parse: (content) =>
            parseJsonResponse<{ categoryId: string; categoryName: string }>(content),
        });
        if (!result.success) return result;
        return this.success({
          suggestedCategoryId: result.data.categoryId,
          suggestedCategoryName: result.data.categoryName,
        });
      }
    }
  }

  async parseSmartSearch(
    userId: string,
    query: string,
    options?: { useCache?: boolean },
  ): Promise<ActionResult<SmartSearchParseResult>> {
    const run = () =>
      this.executeCompletion({
        userId,
        feature: "SMART_SEARCH",
        requestType: AI_REQUEST_TYPES.SMART_SEARCH_PARSE,
        promptVersion: smartSearchPrompt.version,
        systemPrompt: smartSearchPrompt.system,
        userPrompt: smartSearchPrompt.buildUser(query),
        jsonMode: true,
        maxTokens: 500,
        parse: (content) => parseJsonResponse<SmartSearchParseResult>(content),
      });

    if (options?.useCache === false) {
      return run();
    }

    return getCachedSmartSearchParse(query, run);
  }

  async generateLeadSummary(
    userId: string,
    context: LeadSummaryContext,
  ): Promise<ActionResult<{ summary: string }>> {
    return this.executeCompletion({
      userId,
      feature: "LEAD_SUMMARY",
      requestType: AI_REQUEST_TYPES.LEAD_SUMMARY,
      promptVersion: leadSummaryPrompt.version,
      systemPrompt: leadSummaryPrompt.system,
      userPrompt: leadSummaryPrompt.buildUser(context),
      maxTokens: 500,
      parse: (content) => ({ summary: content }),
    });
  }

  async analyzeContent(
    userId: string,
    context: ContentImprovementContext,
  ): Promise<ActionResult<ContentImprovementResult>> {
    return this.executeCompletion({
      userId,
      feature: "CONTENT_IMPROVEMENT",
      requestType: AI_REQUEST_TYPES.CONTENT_IMPROVEMENT,
      promptVersion: contentImprovementPrompt.version,
      systemPrompt: contentImprovementPrompt.system,
      userPrompt: contentImprovementPrompt.buildUser(context),
      jsonMode: true,
      maxTokens: 800,
      parse: (content) => parseJsonResponse<ContentImprovementResult>(content),
    });
  }

  async getUsageStats(since?: Date) {
    return aiUsageRepository.getStats(since);
  }

  assertEnabled(): void {
    if (!isAiEnabled()) {
      throw new ValidationError("AI özellikleri şu anda devre dışı.");
    }
    if (!getAiProvider().isConfigured()) {
      throw new ValidationError("AI sağlayıcısı yapılandırılmamış. Ortam değişkenlerini kontrol edin.");
    }
  }
}

export const aiService = new AiService();
