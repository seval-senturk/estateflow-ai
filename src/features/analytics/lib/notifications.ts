export type AnalyticsNotificationType =
  | "NEW_LEAD"
  | "NEW_BLOG"
  | "SYSTEM_ERROR"
  | "UNAUTHORIZED_ACCESS";

export interface AnalyticsNotificationEvent {
  type: AnalyticsNotificationType;
  metadata?: Record<string, unknown>;
}

export function trackAnalyticsNotification(event: AnalyticsNotificationEvent): void {
  if (process.env.NODE_ENV === "development") {
    void event;
  }
}
