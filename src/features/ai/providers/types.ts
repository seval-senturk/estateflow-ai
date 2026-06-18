import type { AiCompletionRequest, AiCompletionResult, AiProviderName } from "../types";

export interface AiProvider {
  readonly name: AiProviderName;
  complete(request: AiCompletionRequest): Promise<AiCompletionResult>;
  isConfigured(): boolean;
}
