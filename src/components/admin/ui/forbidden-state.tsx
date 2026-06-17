import { ShieldAlert } from "lucide-react";

import { cn } from "@/lib/utils";

interface ForbiddenStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function ForbiddenState({
  title = "Access restricted",
  description = "You do not have permission to view this section.",
  className,
}: ForbiddenStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-56 flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-10 text-center",
        className,
      )}
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <ShieldAlert className="size-5" />
      </div>
      <h3 className="font-heading text-base font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
