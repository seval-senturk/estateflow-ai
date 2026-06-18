import { unstable_cache } from "next/cache";

import { hashAiCacheKey } from "@/features/ai/lib/cache-keys";

const AI_CACHE_REVALIDATE_SECONDS = Number(process.env.AI_CACHE_REVALIDATE_SECONDS ?? 3600);

export const AI_CACHE_TAGS = {
  responses: "ai-responses",
  propertySummary: (key: string) => `ai-property-summary-${key}`,
  smartSearch: (key: string) => `ai-smart-search-${key}`,
} as const;

export async function getCachedPropertySummary<T>(
  description: string,
  title: string | undefined,
  fetcher: () => Promise<T>,
): Promise<T> {
  const key = hashAiCacheKey("property-summary", title ?? "", description);

  return unstable_cache(fetcher, ["ai-property-summary", key], {
    revalidate: AI_CACHE_REVALIDATE_SECONDS,
    tags: [AI_CACHE_TAGS.responses, AI_CACHE_TAGS.propertySummary(key)],
  })();
}

export async function getCachedSmartSearchParse<T>(query: string, fetcher: () => Promise<T>): Promise<T> {
  const key = hashAiCacheKey("smart-search", query.toLowerCase().trim());

  return unstable_cache(fetcher, ["ai-smart-search", key], {
    revalidate: AI_CACHE_REVALIDATE_SECONDS,
    tags: [AI_CACHE_TAGS.responses, AI_CACHE_TAGS.smartSearch(key)],
  })();
}
