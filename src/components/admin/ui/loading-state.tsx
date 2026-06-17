import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface LoadingStateProps {
  label?: string;
  className?: string;
}

export function LoadingState({
  label = "Loading data…",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card/50",
        className,
      )}
    >
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
