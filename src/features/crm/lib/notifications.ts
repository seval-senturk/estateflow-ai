/**
 * CRM notification integration points (foundation only).
 */

export type CrmNotificationType = "NEW_LEAD" | "ASSIGNMENT" | "STATUS_CHANGED";

export interface CrmNotificationEvent {
  type: CrmNotificationType;
  leadId: string;
  agentId?: string;
  statusId?: string;
}

export function trackCrmNotification(event: CrmNotificationEvent): void {
  void event;
}
