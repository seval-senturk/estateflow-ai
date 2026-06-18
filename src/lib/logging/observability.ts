export type ObservabilityProvider = "sentry" | "posthog" | "google-analytics" | "opentelemetry";

export interface ObservabilityEvent {
  type: "activity" | "audit" | "security" | "error";
  action?: string;
  entityType?: string;
  entityId?: string;
  userId?: string;
  message?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Foundation hook for external monitoring providers.
 * Wire Sentry, PostHog, GA, or OpenTelemetry here in a future phase.
 */
export function emitObservabilityEvent(event: ObservabilityEvent): void {
  if (process.env.NODE_ENV === "development") {
    void event;
  }
}

export function registerObservabilityProvider(provider: ObservabilityProvider): void {
  void provider;
}
