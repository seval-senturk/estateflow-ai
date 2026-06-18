import type { ActivityAction } from "@prisma/client";

import type { LogContext } from "@/types/logging";

import { trackActivity } from "./activity-tracker";

export type SecurityEventType =
  | "FAILED_LOGIN"
  | "UNAUTHORIZED_ACCESS"
  | "PERMISSION_VIOLATION"
  | "SESSION_EXPIRED";

const SECURITY_DESCRIPTIONS: Record<SecurityEventType, string> = {
  FAILED_LOGIN: "Başarısız giriş denemesi",
  UNAUTHORIZED_ACCESS: "Yetkisiz erişim denemesi",
  PERMISSION_VIOLATION: "İzin ihlali",
  SESSION_EXPIRED: "Oturum süresi doldu",
};

export interface TrackSecurityEventInput {
  type: SecurityEventType;
  userId?: string;
  metadata?: Record<string, unknown>;
  context?: LogContext;
}

export async function trackSecurityEvent(input: TrackSecurityEventInput): Promise<void> {
  const action: ActivityAction =
    input.type === "FAILED_LOGIN" ? "LOGIN" : "VIEW";

  await trackActivity({
    userId: input.userId,
    action,
    entityType: "SECURITY",
    description: SECURITY_DESCRIPTIONS[input.type],
    metadata: { securityEvent: input.type, ...input.metadata },
    context: input.context,
  });
}
