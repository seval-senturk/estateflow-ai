import { getAiConfig } from "@/config/ai";

import { AzureOpenAiProvider, OpenAiProvider } from "./openai.provider";
import type { AiProvider } from "./types";

let cachedProvider: AiProvider | null = null;

export function getAiProvider(): AiProvider {
  if (cachedProvider) return cachedProvider;

  const config = getAiConfig();
  if (!config.enabled) {
    cachedProvider = new OpenAiProvider();
    return cachedProvider;
  }

  if (config.provider === "azure-openai") {
    cachedProvider = new AzureOpenAiProvider();
    return cachedProvider;
  }

  cachedProvider = new OpenAiProvider();
  return cachedProvider;
}

export function isAiConfigured(): boolean {
  if (!getAiConfig().enabled) return false;
  return getAiProvider().isConfigured();
}

export function resetAiProviderCache(): void {
  cachedProvider = null;
}
