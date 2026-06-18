"use client";

import { cn } from "@/lib/utils";
import type { LeadStatusRef } from "../types";

interface LeadStatusBadgeProps {
  status: LeadStatusRef;
  className?: string;
}

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        className,
      )}
      style={{
        borderColor: status.color ?? undefined,
        color: status.color ?? undefined,
        backgroundColor: status.color ? `${status.color}14` : undefined,
      }}
    >
      {status.name}
    </span>
  );
}
