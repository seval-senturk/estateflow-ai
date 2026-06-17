"use client";

import type { BlogPostStatus } from "@prisma/client";

import { cn } from "@/lib/utils";

import { BLOG_POST_STATUS_LABELS } from "../constants";

const STATUS_STYLES: Record<BlogPostStatus, string> = {
  DRAFT: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  PUBLISHED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  ARCHIVED: "border-muted-foreground/30 bg-muted text-muted-foreground",
};

interface BlogStatusBadgeProps {
  status: BlogPostStatus;
  className?: string;
}

export function BlogStatusBadge({ status, className }: BlogStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
        className,
      )}
    >
      {BLOG_POST_STATUS_LABELS[status]}
    </span>
  );
}
