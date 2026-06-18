import type { ActivityAction, Prisma } from "@prisma/client";

import { prisma } from "@/lib/database";
import type { LogContext, LoggableEntity } from "@/types/logging";

import { getLogContext } from "./context";
import { emitObservabilityEvent } from "./observability";

export interface TrackActivityInput {
  userId?: string;
  action: ActivityAction;
  entityType?: LoggableEntity | string;
  entityId?: string;
  description: string;
  metadata?: Record<string, unknown>;
  context?: LogContext;
}

export async function trackActivity(input: TrackActivityInput): Promise<void> {
  try {
    const context = input.context ?? (await getLogContext(input.userId));

    await prisma.activityLog.create({
      data: {
        userId: input.userId ?? context.userId ?? null,
        action: input.action,
        entityType: input.entityType ?? null,
        entityId: input.entityId ?? null,
        description: input.description,
        metadata: (input.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
        ipAddress: context.ipAddress ?? null,
        userAgent: context.userAgent ?? null,
      },
    });

    emitObservabilityEvent({
      type: "activity",
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      userId: input.userId,
    });
  } catch {
    // Logging must not break primary workflows.
  }
}
