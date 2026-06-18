import { getAiConfig } from "@/config/ai";
import { AI_RATE_LIMIT_WINDOW_MS } from "../constants";
import { AiError } from "../lib/ai-errors";

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function checkRateLimit(rateLimitKey: string, maxPerMinute?: number): void {
  const config = getAiConfig();
  const limit = maxPerMinute ?? config.maxRequestsPerMinute;
  const now = Date.now();
  const entry = rateLimitStore.get(rateLimitKey);

  if (!entry || now - entry.windowStart > AI_RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(rateLimitKey, { count: 1, windowStart: now });
    return;
  }

  if (entry.count >= limit) {
    throw new AiError(
      "Dakikalık AI istek limitine ulaşıldı. Lütfen kısa süre sonra tekrar deneyin.",
      "AI_RATE_LIMIT",
    );
  }

  entry.count += 1;
  rateLimitStore.set(rateLimitKey, entry);
}

export function checkPublicRateLimit(rateLimitKey: string): void {
  checkRateLimit(rateLimitKey, getAiConfig().publicMaxRequestsPerMinute);
}

export function assertTokenBudget(systemPrompt: string, userPrompt: string, maxTokens: number): void {
  const estimated = estimateTokens(systemPrompt) + estimateTokens(userPrompt) + maxTokens;
  const config = getAiConfig();

  if (estimated > config.maxTokensPerRequest) {
    throw new AiError("İstek token limitini aşıyor. İçeriği kısaltın.", "AI_TOKEN_LIMIT");
  }
}
