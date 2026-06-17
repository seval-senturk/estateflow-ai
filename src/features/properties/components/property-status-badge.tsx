"use client";

import { cn } from "@/lib/utils";

interface PropertyStatusBadgeProps {
  label: string;
  color?: string | null;
  className?: string;
}

export function PropertyStatusBadge({ label, color, className }: PropertyStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        className,
      )}
      style={{
        borderColor: color ?? undefined,
        color: color ?? undefined,
        backgroundColor: color ? `${color}14` : undefined,
      }}
    >
      {label}
    </span>
  );
}
