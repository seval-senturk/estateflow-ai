import type { AuditAction, Prisma } from "@prisma/client";

import { prisma } from "@/lib/database";
import type { LogContext, LoggableEntity } from "@/types/logging";

import { getLogContext } from "./context";
import { computeChanges } from "./diff";
import { emitObservabilityEvent } from "./observability";

export interface TrackAuditInput {
  userId?: string;
  action: AuditAction;
  entityType: LoggableEntity | string;
  entityId: string;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  context?: LogContext;
}

export async function trackAudit(input: TrackAuditInput): Promise<void> {
  try {
    const context = input.context ?? (await getLogContext(input.userId));
    const changes = computeChanges(input.oldValues, input.newValues);

    await prisma.auditLog.create({
      data: {
        userId: input.userId ?? context.userId ?? null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        oldValues: (input.oldValues ?? undefined) as Prisma.InputJsonValue | undefined,
        newValues: (input.newValues ?? undefined) as Prisma.InputJsonValue | undefined,
        changes: (changes ?? undefined) as Prisma.InputJsonValue | undefined,
        ipAddress: context.ipAddress ?? null,
        userAgent: context.userAgent ?? null,
      },
    });

    emitObservabilityEvent({
      type: "audit",
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      userId: input.userId,
    });
  } catch {
    // Audit logging must not break primary workflows.
  }
}
