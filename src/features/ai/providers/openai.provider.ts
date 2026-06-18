import { getAiConfig } from "@/config/ai";
import { AI_REQUEST_TIMEOUT_MS } from "../constants";
import { AiError } from "../lib/ai-errors";
import type { AiCompletionRequest, AiCompletionResult } from "../types";
import type { AiProvider } from "./types";

interface ChatCompletionResponse {
  choices?: Array<{ message?: { content?: string } }>;
  model?: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  error?: { message?: string; code?: string };
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new AiError("AI isteği zaman aşımına uğradı.", "AI_TIMEOUT");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function mapProviderError(status: number, body: ChatCompletionResponse): never {
  const message = body.error?.message ?? "AI sağlayıcısı hata döndürdü.";

  if (status === 429) {
    throw new AiError("AI istek limiti aşıldı. Lütfen kısa süre sonra tekrar deneyin.", "AI_RATE_LIMIT");
  }
  if (status === 401 || status === 403) {
    throw new AiError("AI sağlayıcı kimlik doğrulaması başarısız.", "AI_PROVIDER_ERROR");
  }
  throw new AiError(message, "AI_PROVIDER_ERROR");
}

function parseCompletionResponse(
  body: ChatCompletionResponse,
  model: string,
  latencyMs: number,
): AiCompletionResult {
  const content = body.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new AiError("AI geçersiz veya boş yanıt döndürdü.", "AI_INVALID_RESPONSE");
  }

  return {
    content,
    model: body.model ?? model,
    inputTokens: body.usage?.prompt_tokens,
    outputTokens: body.usage?.completion_tokens,
    totalTokens: body.usage?.total_tokens,
    latencyMs,
  };
}

export class OpenAiProvider implements AiProvider {
  readonly name = "openai" as const;

  isConfigured(): boolean {
    const config = getAiConfig();
    return Boolean(config.openai.apiKey);
  }

  async complete(request: AiCompletionRequest): Promise<AiCompletionResult> {
    const config = getAiConfig();
    if (!config.openai.apiKey) {
      throw new AiError("OpenAI API anahtarı yapılandırılmamış.", "AI_NOT_CONFIGURED");
    }

    const started = Date.now();
    const response = await fetchWithTimeout(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.openai.apiKey}`,
        },
        body: JSON.stringify({
          model: config.openai.model,
          temperature: request.temperature ?? config.defaultTemperature,
          max_tokens: request.maxTokens ?? config.defaultMaxTokens,
          response_format: request.jsonMode ? { type: "json_object" } : undefined,
          messages: [
            { role: "system", content: request.systemPrompt },
            { role: "user", content: request.userPrompt },
          ],
        }),
      },
      AI_REQUEST_TIMEOUT_MS,
    );

    const body = (await response.json()) as ChatCompletionResponse;
    if (!response.ok) {
      mapProviderError(response.status, body);
    }

    return parseCompletionResponse(body, config.openai.model, Date.now() - started);
  }
}

export class AzureOpenAiProvider implements AiProvider {
  readonly name = "azure-openai" as const;

  isConfigured(): boolean {
    const config = getAiConfig();
    return Boolean(config.azure.apiKey && config.azure.endpoint && config.azure.deployment);
  }

  async complete(request: AiCompletionRequest): Promise<AiCompletionResult> {
    const config = getAiConfig();
    if (!this.isConfigured()) {
      throw new AiError("Azure OpenAI yapılandırması eksik.", "AI_NOT_CONFIGURED");
    }

    const endpoint = config.azure.endpoint!.replace(/\/$/, "");
    const url = `${endpoint}/openai/deployments/${config.azure.deployment}/chat/completions?api-version=${config.azure.apiVersion}`;

    const started = Date.now();
    const response = await fetchWithTimeout(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": config.azure.apiKey!,
        },
        body: JSON.stringify({
          temperature: request.temperature ?? config.defaultTemperature,
          max_tokens: request.maxTokens ?? config.defaultMaxTokens,
          response_format: request.jsonMode ? { type: "json_object" } : undefined,
          messages: [
            { role: "system", content: request.systemPrompt },
            { role: "user", content: request.userPrompt },
          ],
        }),
      },
      AI_REQUEST_TIMEOUT_MS,
    );

    const body = (await response.json()) as ChatCompletionResponse;
    if (!response.ok) {
      mapProviderError(response.status, body);
    }

    return parseCompletionResponse(body, config.azure.deployment!, Date.now() - started);
  }
}
