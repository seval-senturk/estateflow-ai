import { z } from "zod";

import {
  AI_DEFAULT_MAX_TOKENS,
  AI_DEFAULT_TEMPERATURE,
} from "@/features/ai/constants/limits";
import type { AiProviderName } from "@/features/ai/types";

const aiProviderSchema = z.enum(["openai", "azure-openai"]);

const aiConfigSchema = z.object({
  enabled: z.boolean(),
  provider: aiProviderSchema,
  defaultMaxTokens: z.number().int().positive(),
  defaultTemperature: z.number().min(0).max(2),
  maxRequestsPerMinute: z.number().int().positive(),
  maxTokensPerRequest: z.number().int().positive(),
  openai: z.object({
    apiKey: z.string().optional(),
    model: z.string(),
  }),
  azure: z.object({
    apiKey: z.string().optional(),
    endpoint: z.string().url().optional(),
    deployment: z.string().optional(),
    apiVersion: z.string(),
  }),
});

export type AiConfig = z.infer<typeof aiConfigSchema>;

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined || value === "") return defaultValue;
  return value === "true" || value === "1";
}

export function getAiConfig(): AiConfig {
  const provider = (process.env.AI_PROVIDER ?? "openai") as AiProviderName;

  return aiConfigSchema.parse({
    enabled: parseBoolean(process.env.AI_ENABLED, true),
    provider,
    defaultMaxTokens: Number(process.env.AI_DEFAULT_MAX_TOKENS ?? AI_DEFAULT_MAX_TOKENS),
    defaultTemperature: Number(process.env.AI_DEFAULT_TEMPERATURE ?? AI_DEFAULT_TEMPERATURE),
    maxRequestsPerMinute: Number(process.env.AI_MAX_REQUESTS_PER_MINUTE ?? 20),
    maxTokensPerRequest: Number(process.env.AI_MAX_TOKENS_PER_REQUEST ?? 4000),
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    },
    azure: {
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT,
      deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
      apiVersion: process.env.AZURE_OPENAI_API_VERSION ?? "2024-02-15-preview",
    },
  });
}

export function isAiEnabled(): boolean {
  return getAiConfig().enabled;
}
